import React, { useState, useEffect, useMemo } from 'react';
import { Upload, BookOpen, CheckCircle, XCircle, Clock, CalendarDays, ChevronLeft, ChevronRight, Filter, ChevronDown, AlertCircle, Download, FileSpreadsheet, FileText, Link, Zap, Shield, Award, Archive, Info, Eye, PieChart as PieChartIcon, Sparkles, Pencil, Trash2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, PieChart as ReChartsPie, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { PdfPreviewModal } from '../../components/ui/pdf-preview-modal';
import { DocumentDetailDrawer } from '../../components/ui/document-detail-drawer';
import { BaseFormModal } from '../../components/ui/BaseFormModal';

const BUKU_CATEGORIES = [
  { label: 'Buku Referensi', value: 'Buku Referensi', points: 40 },
  { label: 'Buku Ajar', value: 'Buku Ajar', points: 20 },
  { label: 'Buku Monograf', value: 'Buku Monograf', points: 20 },
];

export default function Buku({ user }: { user: any }) {
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);

  const activeDetailDoc = useMemo(() => {
    if (!selectedDocForDetail) return null;
    return documents.find((d: any) => d.id === selectedDocForDetail.id) || selectedDocForDetail;
  }, [documents, selectedDocForDetail]);

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
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // === State Preview Modal ===
  const [previewDoc, setPreviewDoc] = useState<{ fileUrl: string; title: string; category: string } | null>(null);

  // Link Research States
  const [approvedResearch, setApprovedResearch] = useState([]);
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
  const [docToLink, setDocToLink] = useState<any>(null);
  const [isLinkingLoading, setIsLinkingLoading] = useState(false);

  // === Edit & Delete States ===
  const [editDoc, setEditDoc] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Buku Referensi');
  const [editTahun, setEditTahun] = useState('');
  const [editDocType, setEditDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [isEditYearDropdownOpen, setIsEditYearDropdownOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);

  const [deleteDoc, setDeleteDoc] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const load = async () => {
      setIsTableLoading(true);
      await fetchDocuments();
      await fetchApprovedResearch();
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
        setMessage('Buku berhasil dihubungkan ke penelitian!');
        setMessageType('success');
        setIsLinkingModalOpen(false);
        fetchDocuments();
      }
      setTimeout(() => setMessage(''), 4500);
    } catch (err) {
      console.error(err);
      setMessage('Gagal menghubungkan buku.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 4500);
    } finally {
      setIsLinkingLoading(false);
      setDocToLink(null);
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
      pending: filteredDocuments.filter(d => d.status === 'Pending' || d.status === 'Verified by Fakultas').length,
      points: valid.reduce((acc, d) => acc + (Number(d.awarded_points) || 0), 0),
      validCount: valid.length,
    };
  }, [filteredDocuments, currentYear]);

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

  const isDocLocked = (doc: any) =>
    doc.status === 'Verified by Fakultas' || doc.status === 'Approved';

  const openEditModal = (doc: any) => {
    setEditDoc(doc);
    setEditTitle(doc.title || '');
    setEditCategory(doc.category || 'Buku Referensi');
    setEditTahun(doc.published_at ? String(new Date(doc.published_at).getFullYear()) : new Date().getFullYear().toString());
    setEditDocType(doc.is_kpi_counted ? 'kpi' : 'arsip');
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDoc) return;
    try {
      setIsEditLoading(true);
      const res = await fetch(`/api/documents/${editDoc.id}`, {
        method: 'PUT',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, category: editCategory, published_at: `${editTahun}-01-01`, doc_type: editDocType }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Buku berhasil diperbarui!'); setMessageType('success');
        setIsEditModalOpen(false);
        setIsTableLoading(true); await fetchDocuments(); setIsTableLoading(false);
      } else { setMessage(data.message || 'Gagal memperbarui.'); setMessageType('error'); }
      setTimeout(() => setMessage(''), 4500);
    } catch { setMessage('Terjadi kesalahan.'); setMessageType('error'); setTimeout(() => setMessage(''), 4500); }
    finally { setIsEditLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteDoc) return;
    try {
      setIsDeleteLoading(true);
      const res = await fetch(`/api/documents/${deleteDoc.id}`, {
        method: 'DELETE', headers: { 'Accept': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Buku berhasil dihapus!'); setMessageType('success');
        setIsDeleteModalOpen(false); setDeleteDoc(null);
        setIsTableLoading(true); await fetchDocuments(); setCurrentPage(1); setIsTableLoading(false);
      } else { setMessage(data.message || 'Gagal menghapus.'); setMessageType('error'); }
      setTimeout(() => setMessage(''), 4500);
    } catch { setMessage('Terjadi kesalahan.'); setMessageType('error'); setTimeout(() => setMessage(''), 4500); }
    finally { setIsDeleteLoading(false); }
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await fetch('/api/cms/templates');
      if (res.ok) {
        const data = await res.json();
        const template = data.templates?.find((t: any) => t.type === 'buku');
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
        setTimeout(() => setMessage(''), 4500);
      } catch (err) {
        console.error(err);
        setMessage('Terjadi kesalahan saat membaca file Excel.');
        setMessageType('error');
        setTimeout(() => setMessage(''), 4500);
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
      setTimeout(() => setMessage(''), 4500);
    } catch (err) {
      console.error(err);
      setMessage('Terjadi kesalahan saat mengunggah.');
      setMessageType('error');
      setTimeout(() => setMessage(''), 4500);
    } finally {
      setUploadingPdfId(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !category || !tahun) {
      setMessage('Harap lengkapi semua field.'); 
      setMessageType('error'); 
      setTimeout(() => setMessage(''), 4500);
      return;
    }
    if (duplicateFound) {
      setMessage('Dokumen ini sudah terdata.'); 
      setMessageType('error'); 
      setTimeout(() => setMessage(''), 4500);
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
      const res = await fetch('/api/documents', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Buku berhasil diunggah!'); 
        setMessageType('success');
        setTitle(''); 
        setFile(null); 
        setTahun(currentYear.toString());
        setIsUploadModalOpen(false); // Tutup modal saat sukses
        setIsTableLoading(true); 
        await fetchDocuments(); 
        setCurrentPage(1); 
        setIsTableLoading(false);
      } else {
        let errorMsg = data.message || 'Gagal mengunggah.';
        if (data.errors && data.errors.title) {
          errorMsg = data.errors.title[0];
        }
        setMessage(errorMsg); 
        setMessageType('error'); 
      }
      setTimeout(() => setMessage(''), 4500);
    } catch { 
      setMessage('Terjadi kesalahan.'); 
      setMessageType('error'); 
      setTimeout(() => setMessage(''), 4500);
    }
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
    <div className="max-w-none space-y-6 lg:space-y-10 pb-12">

      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-5 py-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30 rounded-2xl"
      >
        <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Pengelolaan Buku Dosen</p>
          <p className="text-sm font-black uppercase tracking-tight">Buku Referensi, Ajar, dan Monograf Dosen</p>
        </div>
        <div className="ml-auto text-[10px] font-bold opacity-75 uppercase tracking-widest hidden md:flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          Registrasikan Karya Tulis dan Buku Akademik Anda
        </div>
      </motion.div>

      {/* Dashboard Summary Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Total Buku', value: stats.total, icon: BookOpen, color: 'blue' },
          { label: 'Disetujui', value: stats.approved, icon: CheckCircle, color: 'emerald' },
          { label: 'Menunggu', value: stats.pending, icon: Clock, color: 'amber' },
          { label: 'Poin Buku', value: stats.points, icon: Sparkles, color: 'indigo' },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`p-3 rounded-xl shrink-0 ${
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
        className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-4 bg-primary-50 dark:bg-primary-950/30 rounded-2xl text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/30 shadow-sm">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Kelola Buku Referensi & Ajar</h3>
            <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">Registrasikan buku baru atau impor data dari Excel secara massal</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-200 dark:shadow-primary-900/20 transition-all active:scale-95"
          >
            Unggah Buku Baru
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </button>
          <button 
            type="button"
            onClick={handleDownloadTemplate}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 text-xs font-black bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors text-gray-700 dark:text-zinc-300 shadow-sm uppercase tracking-wider"
          >
            <Download className="w-4 h-4 mr-2" />
            Template
          </button>
          <label className={`w-full sm:w-auto inline-flex items-center justify-center px-4 py-3 text-xs font-black bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors text-emerald-700 dark:text-emerald-400 shadow-sm cursor-pointer uppercase tracking-wider ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            {isImporting ? 'Importing...' : 'Import Excel'}
            <input type="file" accept=".xlsx, .xls" className="sr-only" onChange={handleImportExcel} disabled={isImporting} />
          </label>
        </div>
      </motion.div>

          
          <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
              <h3 className="text-lg lg:text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight uppercase">Riwayat Buku</h3>
            </div>

            {/* Filter bar */}
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-3 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/10">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </div>
              {['', ...BUKU_CATEGORIES.map(b => b.value)].map(k => (
                <button key={k} onClick={() => { setFilterKategori(k); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterKategori === k ? 'bg-primary-600 text-white' : 'bg-white dark:bg-zinc-900 text-gray-500 border border-gray-200 dark:border-zinc-700 hover:border-primary-300'}`}>
                  {k || 'Semua'}
                </button>
              ))}
            </div>

            <div className="w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-50 dark:divide-zinc-800">
              <thead className="bg-gray-50/30 dark:bg-zinc-800/30">
                  <tr>
                    <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Informasi Buku</th>
                    <th className="hidden lg:table-cell px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Kategori Buku</th>
                    <th className="hidden md:table-cell px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Tahun</th>
                    <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Dokumen</th>
                    <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Status</th>
                    <th className="hidden sm:table-cell px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Klasifikasi</th>
                    <th className="px-4 lg:px-8 py-4 text-right text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Poin</th>
                    <th className="hidden sm:table-cell px-4 lg:px-8 py-4 text-right sm:text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Penelitian Asal</th>
                    <th className="px-4 py-4 w-12 text-center text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Detail</th>
                    <th className="px-4 py-4 text-center text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
                  {isTableLoading ? (
                    [1, 2, 3].map((i) => (
                      <tr key={`skeleton-${i}`} className="animate-pulse">
                        <td className="px-4 lg:px-8 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-gray-100 dark:bg-zinc-800 rounded-lg shrink-0" />
                            <div className="space-y-2 w-full max-w-[200px]">
                              <div className="h-4 w-full bg-gray-200 dark:bg-zinc-700 rounded" />
                              <div className="h-3 w-2/3 bg-gray-100 dark:bg-zinc-800 rounded" />
                            </div>
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-4 lg:px-8 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-zinc-700 rounded" /></td>
                        <td className="hidden md:table-cell px-4 lg:px-8 py-4"><div className="h-4 w-20 bg-gray-200 dark:bg-zinc-700 rounded" /></td>
                        <td className="px-4 lg:px-8 py-4"><div className="h-6 w-20 bg-gray-200 dark:bg-zinc-700 rounded-xl" /></td>
                        <td className="px-4 lg:px-8 py-4"><div className="h-6 w-20 bg-gray-200 dark:bg-zinc-700 rounded-xl" /></td>
                        <td className="hidden sm:table-cell px-4 lg:px-8 py-4"><div className="h-6 w-16 bg-gray-200 dark:bg-zinc-700 rounded-xl" /></td>
                        <td className="px-4 lg:px-8 py-4"><div className="h-6 w-12 bg-gray-200 dark:bg-zinc-700 rounded-lg" /></td>
                        <td className="hidden sm:table-cell px-4 lg:px-8 py-4"><div className="h-6 w-20 bg-gray-200 dark:bg-zinc-700 rounded-lg" /></td>
                      </tr>
                    ))
                  ) : paginatedDocs.length > 0 ? (
                    paginatedDocs.map((doc: any) => {
                      const catInfo = BUKU_CATEGORIES.find(bc => bc.value === doc.category);
                      const docYear = doc.published_at ? new Date(doc.published_at).getFullYear() : 0;
                      return (
                        <tr key={doc.id} className="hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-colors group">
                          <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors shrink-0">
                                <BookOpen className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 dark:text-zinc-500 group-hover:text-primary-600" />
                              </div>
                              <div className="min-w-0 flex-1 max-w-[150px] sm:max-w-[250px] lg:max-w-sm">
                                <p className="text-[11px] sm:text-xs lg:text-sm font-extrabold text-gray-900 dark:text-zinc-100 truncate tracking-tight uppercase" title={doc.title}>{doc.title}</p>
                                <p className="text-[9px] lg:text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate mt-0.5" title={doc.category}>
                                  <span className="lg:hidden">{docYear || '-'} • </span>
                                  {doc.category}
                                </p>

                                {doc.status === 'Rejected' && doc.catatan && (
                                  <div className="mt-2 text-[9px] font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded-lg border border-red-100 dark:border-red-900/30 w-fit uppercase tracking-tight">
                                    Catatan Umpan Balik: {doc.catatan}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          
                          <td className="hidden lg:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle">
                            <span className="text-xs font-bold text-gray-600 dark:text-zinc-300 uppercase tracking-wide truncate max-w-[150px] block" title={doc.category}>{doc.category}</span>
                          </td>
                          
                          <td className="hidden md:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle text-xs font-black text-gray-500 dark:text-zinc-400 font-mono italic">
                            {docYear || '-'}
                          </td>

                          <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                            {doc.file_url && doc.file_url !== '-' ? (
                              <button
                                onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-[10px] font-black uppercase tracking-widest transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5 mr-1" /> Lihat Dokumen
                              </button>
                            ) : (
                              <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-zinc-800 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer">
                                {uploadingPdfId === doc.id ? (
                                  <span className="animate-pulse">Uploading...</span>
                                ) : (
                                  <>
                                    <Upload className="w-3.5 h-3.5 mr-1" /> Upload File
                                    <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" className="sr-only" onChange={(e) => handleUploadPdf(e, doc.id)} disabled={uploadingPdfId === doc.id} />
                                  </>
                                )}
                              </label>
                            )}
                          </td>
                          
                          <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                            <div className={`inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-xl font-black text-[9px] lg:text-[10px] uppercase tracking-widest ${getStatusColor(doc.status)}`}>
                              {getStatusIcon(doc.status)}
                              <span className="ml-1">{doc.status}</span>
                            </div>
                          </td>
                          
                          <td className="hidden sm:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle">
                            {doc.is_kpi_counted ? (
                              <div className="inline-flex items-center gap-1.5 text-[9px] lg:text-[10px] font-black uppercase text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1.5 rounded-xl border border-primary-100">
                                <Sparkles className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                                KPI
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 text-[9px] lg:text-[10px] font-black uppercase text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 px-2.5 py-1.5 rounded-xl border border-gray-100">
                                <Archive className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                                Arsip
                              </div>
                            )}
                          </td>
                          
                          <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                            <div className="flex flex-col items-end sm:items-start">
                              <span className="text-[11px] sm:text-xs lg:text-sm font-black text-primary-800 dark:text-primary-400 tracking-tighter">
                                +{doc.awarded_points || 0} PTS
                              </span>
                            </div>
                          </td>

                          {/* Connect to Research column */}
                          <td className="hidden sm:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle text-right sm:text-left">
                            {doc.penelitian ? (
                              <div className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-md border border-indigo-100 max-w-[150px] truncate">
                                <Link className="w-2.5 h-2.5 shrink-0" />
                                <span className="text-[9px] font-black uppercase tracking-tight truncate" title={doc.penelitian.judul_penelitian}>
                                  {doc.penelitian.judul_penelitian}
                                </span>
                                <button 
                                  onClick={() => { setDocToLink(doc); setIsLinkingModalOpen(true); }}
                                  className="ml-auto text-[9px] font-black text-indigo-400 hover:text-indigo-600 uppercase"
                                >
                                  Ubah
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => { setDocToLink(doc); setIsLinkingModalOpen(true); }}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 dark:bg-zinc-800 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 text-[9px] font-black uppercase tracking-widest rounded-md border transition-all"
                              >
                                <Link className="w-3 h-3" /> Pilih Penelitian Asal
                              </button>
                            )}
                          </td>

                          {/* View Detail Button */}
                          <td className="px-4 py-4 text-center align-middle">
                            <button
                              type="button"
                              onClick={() => setSelectedDocForDetail(doc)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 dark:text-zinc-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all flex items-center justify-center mx-auto"
                              title="Lihat Detail"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                          </td>

                          {/* Aksi */}
                          <td className="px-4 py-4 text-center align-middle">
                            {isDocLocked(doc) ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-300 dark:text-zinc-600 text-[9px] font-black uppercase tracking-widest cursor-not-allowed" title="Dokumen sudah diverifikasi — tidak dapat diubah">
                                <Lock className="w-3 h-3" /> Terkunci
                              </span>
                            ) : (
                              <div className="flex items-center justify-center gap-1">
                                <button type="button" onClick={() => openEditModal(doc)}
                                  className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 text-gray-400 hover:text-blue-600 transition-all" title="Edit Buku">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={() => { setDeleteDoc(doc); setIsDeleteModalOpen(true); }}
                                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-600 transition-all" title="Hapus Buku">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 lg:px-8 py-16 text-center">
                        <div className="flex flex-col items-center">
                           <BookOpen className="w-12 h-12 text-gray-200 dark:text-zinc-700 mb-4" />
                           <p className="text-sm font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest italic">Inventory Empty</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {!isTableLoading && filteredDocuments.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-6 py-5 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/10 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredDocuments.length)} of {filteredDocuments.length} entries
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
                    <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Hubungkan buku ini dengan penelitian yang relevan</p>
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

      {/* Upload Buku Modal Pop-up */}
      <BaseFormModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Unggah Buku Baru"
        subtitle="Daftarkan Buku Ajar, Referensi, atau Monograf"
        icon={Upload}
        iconColorClass="text-primary-500"
        maxWidthClass="max-w-6xl"
      >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                  {/* Left Side: Upload Form */}
                  <div className="lg:col-span-2">
                    <form onSubmit={handleUpload} className="space-y-6">
                      {duplicateFound && (
                        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl text-[11px] font-bold text-amber-700 dark:text-amber-400">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> Judul ini sudah ada di database.
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setDocType('kpi')}
                          className={`group relative flex items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                            docType === 'kpi'
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/10 ring-4 ring-emerald-500/10'
                              : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:shadow-sm'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors ${
                            docType === 'kpi' ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-gray-100 dark:bg-zinc-800 group-hover:bg-emerald-50'
                          }`}>
                            <Sparkles className={`w-5 h-5 ${docType === 'kpi' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 group-hover:text-emerald-500'}`} />
                          </div>
                          <div className="text-left min-w-0">
                            <p className={`text-[11px] font-black uppercase tracking-tight ${docType === 'kpi' ? 'text-emerald-900 dark:text-emerald-200' : 'text-gray-500 group-hover:text-gray-900'}`}>
                              KPI Dosen
                            </p>
                            <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Automated Scoring</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDocType('arsip')}
                          className={`group relative flex items-center p-4 rounded-xl border-2 transition-all duration-300 ${
                            docType === 'arsip'
                              ? 'border-gray-500 bg-gray-50 dark:bg-zinc-800 ring-4 ring-gray-500/10'
                              : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:shadow-sm'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors ${
                            docType === 'arsip' ? 'bg-gray-200 dark:bg-zinc-700' : 'bg-gray-100 dark:bg-zinc-800 group-hover:bg-gray-200/60'
                          }`}>
                            <Archive className={`w-5 h-5 ${docType === 'arsip' ? 'text-gray-600 dark:text-zinc-300' : 'text-gray-400 group-hover:text-gray-500'}`} />
                          </div>
                          <div className="text-left min-w-0">
                            <p className={`text-[11px] font-black uppercase tracking-tight ${docType === 'arsip' ? 'text-gray-900 dark:text-zinc-100' : 'text-gray-500 group-hover:text-gray-900'}`}>
                              Arsip Umum
                            </p>
                            <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Storage Only (0 Pts)</p>
                          </div>
                        </button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Judul Buku</label>
                        <input 
                          type="text"
                          required
                          value={title} 
                          onChange={e => setTitle(e.target.value)} 
                          placeholder="Masukkan judul buku..."
                          className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100" 
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Kategori</label>
                          <div className="relative">
                            <select 
                              value={category} 
                              onChange={e => setCategory(e.target.value)}
                              className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all outline-none text-sm appearance-none cursor-pointer text-gray-900 dark:text-zinc-100"
                            >
                              {BUKU_CATEGORIES.map(bc => (
                                <option className="bg-white dark:bg-zinc-900 text-gray-950 dark:text-zinc-100" key={bc.value} value={bc.value}>{bc.label} (+{bc.points} pts)</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                          </div>
                        </div>

                        <div className="space-y-2 relative">
                          <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center">
                            <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary-500" />
                            Tahun Terbit
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

                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">File Buku (PDF)</label>
                        <div 
                          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                          onDragLeave={() => setIsDragging(false)} 
                          onDrop={handleDrop}
                          onClick={() => document.getElementById('buku-file-input-modal')?.click()}
                          className={`relative group mt-1 flex justify-center px-6 py-8 border-2 rounded-xl transition-all duration-300 cursor-pointer ${
                            isDragging 
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-8 ring-primary-500/10 scale-[1.01]' 
                              : file 
                                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' 
                                : 'border-gray-200 dark:border-zinc-800 border-dashed bg-gray-50/30 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-900 hover:border-primary-400'
                          }`}
                        >
                          <input
                            id="buku-file-input-modal"
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
                                {file ? 'Buku Terpilih!' : 'Drag & Drop PDF'}
                              </p>
                              <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate max-w-[250px]">
                                {file ? file.name : 'Klik atau seret file buku ke sini'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                       <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                        {scoringPreview ? (
                          <div className="px-4 py-2.5 rounded-xl border-2 flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400 w-full sm:w-auto">
                            <Sparkles className="h-5 w-5 shrink-0 text-emerald-600" />
                            <div className="min-w-0">
                              <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Estimasi Poin</p>
                              <p className="text-xs font-black truncate">{scoringPreview.message}</p>
                            </div>
                          </div>
                        ) : (
                          <div />
                        )}

                        <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => setIsUploadModalOpen(false)}
                            className="px-5 py-3 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex-1 sm:flex-none"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            disabled={loading || !!duplicateFound}
                            className="px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-200 dark:shadow-primary-900/20 transition-all active:scale-95 disabled:opacity-50 flex-1 sm:flex-none"
                          >
                            {loading ? 'Mengunggah...' : 'Kirim Buku'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* Right Side Guide Panel */}
                  <div className="space-y-6 lg:col-span-1">
                    <div className="bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800/60 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-4 border-b border-gray-100/80 dark:border-zinc-800 pb-2.5">
                        <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-zinc-200">Panduan Poin Buku</h4>
                      </div>
                      <div className="flex flex-col gap-3">
                        {[
                          { label: 'Buku Referensi', pts: '40 PTS', desc: 'Buku kajian mendalam bidang ilmu' },
                          { label: 'Buku Ajar', pts: '20 PTS', desc: 'Buku pegangan proses belajar mengajar' },
                          { label: 'Buku Monograf', pts: '20 PTS', desc: 'Buku hasil penelitian tunggal / spesifik' },
                        ].map((bc) => (
                          <div key={bc.label} className="p-3 bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900 rounded-2xl flex items-center justify-between gap-3 shadow-sm hover:scale-[1.02] transition-transform duration-300">
                            <div>
                              <span className="block text-[10px] font-black text-gray-800 dark:text-zinc-200 uppercase tracking-wide">{bc.label}</span>
                              <span className="block text-[9px] font-bold text-gray-400 mt-0.5">{bc.desc}</span>
                            </div>
                            <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 bg-white dark:bg-zinc-900 px-2.5 py-1.5 rounded-xl border border-primary-100 dark:border-primary-800/50 shrink-0 shadow-sm">
                              +{bc.pts}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-primary-50 dark:bg-primary-950/10 border border-primary-100 dark:border-primary-900/30 rounded-xl">
                      <h4 className="text-[10px] font-black uppercase text-primary-800 dark:text-primary-300 tracking-wider mb-1">Informasi Verifikasi</h4>
                      <p className="text-[9px] font-bold text-primary-700/80 dark:text-primary-400/80 leading-relaxed">
                        Buku yang diunggah akan melalui proses verifikasi oleh LPPM sebelum secara resmi tercatat dalam performa kinerja KPI dosen.
                      </p>
                    </div>
                  </div>
                </div>
              </BaseFormModal>

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
      {/* Detail Slide-over Drawer */}
      <DocumentDetailDrawer
        isOpen={!!activeDetailDoc}
        onClose={() => setSelectedDocForDetail(null)}
        drawerTitle="Detail Buku"
        drawerSubtitle="Informasi & Output Akademik"
        category={activeDetailDoc?.category ?? ''}
        title={activeDetailDoc?.title ?? ''}
        status={activeDetailDoc?.status ?? ''}
        catatan={activeDetailDoc?.catatan}
        year={activeDetailDoc?.published_at ? new Date(activeDetailDoc.published_at).getFullYear() : '-'}
        points={activeDetailDoc?.awarded_points || 0}
        isKpiCounted={activeDetailDoc?.is_kpi_counted}
        hideKpiClassification={false}
        showResearchLink={true}
        linkedResearch={activeDetailDoc?.penelitian}
        onChangeResearchClick={() => { setDocToLink(activeDetailDoc); setIsLinkingModalOpen(true); }}
        onLinkResearchClick={() => { setDocToLink(activeDetailDoc); setIsLinkingModalOpen(true); }}
        fileUrl={activeDetailDoc?.file_url}
        docId={activeDetailDoc?.id ?? 0}
        uploadingPdfId={uploadingPdfId}
        onPreviewClick={() => setPreviewDoc({ fileUrl: activeDetailDoc?.file_url, title: activeDetailDoc?.title, category: activeDetailDoc?.category })}
        onUploadPdf={handleUploadPdf}
      />

      {/* PDF Preview Modal */}
      <PdfPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        fileUrl={previewDoc?.fileUrl ?? null}
        title={previewDoc?.title}
        category={previewDoc?.category}
      />

      {/* ===== EDIT MODAL ===== */}
      <BaseFormModal
        isOpen={isEditModalOpen && !!editDoc}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Buku"
        subtitle={editDoc ? `Perbarui data buku #${editDoc.id}` : undefined}
        icon={Pencil}
        iconColorClass="text-blue-500"
        maxWidthClass="max-w-lg"
      >
        {editDoc && (
          <form id="edit-buku-form" onSubmit={handleUpdate} className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    {(['kpi', 'arsip'] as const).map(t => (
                      <button key={t} type="button" onClick={() => setEditDocType(t)}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${editDocType === t ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20' : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200'}`}>
                        {t === 'kpi' ? <Sparkles className="w-4 h-4 text-emerald-500" /> : <Archive className="w-4 h-4 text-gray-400" />}
                        <div className="text-left"><p className="text-[11px] font-black uppercase tracking-tight">{t === 'kpi' ? 'KPI' : 'Arsip'}</p><p className="text-[9px] text-gray-400">{t === 'kpi' ? 'Masuk Poin KPI' : '0 Pts'}</p></div>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Judul Buku</label>
                    <input type="text" required value={editTitle} onChange={e => setEditTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">Kategori Buku</label>
                    <select value={editCategory} onChange={e => setEditCategory(e.target.value)} required
                      className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100 cursor-pointer">
                      {BUKU_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2 relative">
                    <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center"><CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary-500" />Tahun Terbit</label>
                    <button type="button" onClick={() => setIsEditYearDropdownOpen(!isEditYearDropdownOpen)}
                      className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-left flex justify-between items-center text-gray-900 dark:text-zinc-100">
                      <span>{editTahun}</span><ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isEditYearDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isEditYearDropdownOpen && (
                        <><div className="fixed inset-0 z-20" onClick={() => setIsEditYearDropdownOpen(false)} />
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="absolute z-30 w-full mt-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="max-h-48 overflow-y-auto p-2.5 grid grid-cols-3 gap-1.5">
                              {Array.from({ length: 24 }, (_, i) => (
                                (() => {
                                  const y = (new Date().getFullYear() - 10 + i).toString();
                                  return (
                                    <button key={y} type="button" onClick={() => { setEditTahun(y); setIsEditYearDropdownOpen(false); }}
                                      className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${editTahun === y ? 'bg-primary-600 border-primary-600 text-white' : 'border-transparent bg-gray-50/50 dark:bg-zinc-800/50 text-gray-600 hover:border-primary-200'}`}>{y}</button>
                                  );
                                })()
                              ))}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl text-xs font-black uppercase tracking-wider transition-all">Batal</button>
              <button type="submit" disabled={isEditLoading} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50">{isEditLoading ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
            </div>
          </form>
        )}
      </BaseFormModal>

      {/* ===== DELETE MODAL ===== */}
      <AnimatePresence>
        {isDeleteModalOpen && deleteDoc && (
          <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-950/70 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-gray-200 dark:border-zinc-800 p-8">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center"><Trash2 className="w-8 h-8 text-red-500" /></div>
                <div><h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Hapus Buku?</h3><p className="text-xs font-bold text-gray-400 dark:text-zinc-500 mt-1">Tindakan ini tidak dapat dibatalkan.</p></div>
                <div className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700">
                  <p className="text-xs font-black text-gray-700 dark:text-zinc-300 uppercase tracking-tight">{deleteDoc.title}</p>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 mt-1 uppercase tracking-widest">{deleteDoc.category}</p>
                </div>
                <div className="flex gap-3 w-full mt-2">
                  <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-3 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl text-xs font-black uppercase tracking-wider transition-all">Batal</button>
                  <button onClick={handleDelete} disabled={isDeleteLoading} className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-200 dark:shadow-red-900/30 transition-all active:scale-95 disabled:opacity-60">{isDeleteLoading ? 'Menghapus...' : 'Ya, Hapus'}</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}



