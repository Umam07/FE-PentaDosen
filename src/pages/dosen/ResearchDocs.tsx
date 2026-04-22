/**
 * ResearchDocs.tsx
 * Halaman untuk dokumen penunjang penelitian: Proposal dan Laporan.
 * Kategori ini masuk ke menu Penelitian (bukan Publikasi),
 * karena Proposal & Laporan adalah dokumen proses penelitian, bukan output publikasi.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Upload, FileText, CheckCircle, XCircle, Clock, CalendarDays,
  Archive, Award, Zap, ChevronLeft, ChevronRight, AlertCircle,
  FileSignature, ClipboardList, Info, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Konfigurasi per tipe dokumen
const DOC_TYPE_CONFIG: Record<string, {
  label: string;
  description: string;
  icon: any;
  color: string;
  accentClass: string;
  category: string; // category value yang dikirim ke backend (harus cocok dengan weights)
}> = {
  proposal: {
    label: 'Proposal Penelitian',
    description: 'Dokumen rencana penelitian yang diajukan untuk mendapatkan persetujuan dan pendanaan.',
    icon: FileSignature,
    color: 'violet',
    accentClass: 'bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-400 border-violet-100 dark:border-violet-900/30',
    category: 'Proposal',
  },
  laporan: {
    label: 'Laporan Penelitian',
    description: 'Dokumen laporan kemajuan atau akhir dari kegiatan penelitian yang telah dilaksanakan.',
    icon: ClipboardList,
    color: 'teal',
    accentClass: 'bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 border-teal-100 dark:border-teal-900/30',
    category: 'Laporan',
  },
};

export default function ResearchDocs({ user }: { user: any }) {
  const location = useLocation();
  // Deteksi tipe dokumen dari path (/research/proposal atau /research/laporan)
  const pathKey = location.pathname.split('/').pop()?.toLowerCase() || 'proposal';
  const config = DOC_TYPE_CONFIG[pathKey] || DOC_TYPE_CONFIG['proposal'];
  const DocIcon = config.icon;

  const [documents, setDocuments] = useState([]);
  const [weights, setWeights] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [isTableLoading, setIsTableLoading] = useState(true);
  const [isWeightsLoading, setIsWeightsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isDragging, setIsDragging] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchWeights();
    const load = async () => {
      setIsTableLoading(true);
      await fetchDocuments();
      setIsTableLoading(false);
    };
    load();
  }, [location.pathname]);

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`/api/users/${user.id}/documents`);
      const data = await res.json();
      // Filter hanya dokumen sesuai kategori (Proposal / Laporan)
      const filtered = (data.documents || []).filter(
        (d: any) => (d.category || '').toLowerCase() === config.category.toLowerCase()
      );
      setDocuments(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWeights = async () => {
    setIsWeightsLoading(true);
    try {
      const res = await fetch('/api/weights');
      const data = await res.json();
      setWeights(data.weights || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsWeightsLoading(false);
    }
  };

  const categoryWeight = useMemo(() => {
    return weights.find((w: any) => w.category?.toLowerCase() === config.category.toLowerCase());
  }, [weights, config.category]);

  const stats = useMemo(() => ({
    total: documents.length,
    approved: documents.filter((d: any) => d.status === 'Approved').length,
    pending: documents.filter((d: any) => d.status === 'Pending' || d.status === 'Verified by Prodi').length,
    points: documents.reduce((acc: number, d: any) => acc + (Number(d.awarded_points) || 0), 0),
  }), [documents]);

  const duplicateFound = useMemo(() => {
    if (!title || title.length < 5) return null;
    return documents.find((doc: any) =>
      doc.title.toLowerCase().trim() === title.toLowerCase().trim() && doc.is_kpi_counted
    );
  }, [title, documents]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !tahun) {
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
    formData.append('category', config.category);
    formData.append('user_id', user.id);
    formData.append('published_at', `${tahun}-01-01`);
    formData.append('doc_type', 'kpi');

    try {
      setLoading(true);
      const res = await fetch('/api/documents', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Dokumen berhasil diunggah!');
        setMessageType('success');
        setTitle('');
        setFile(null);
        setTahun(new Date().getFullYear().toString());
        setIsTableLoading(true);
        await fetchDocuments();
        setCurrentPage(1);
        setIsTableLoading(false);
      } else {
        setMessage('Gagal mengunggah dokumen.');
        setMessageType('error');
      }
    } catch {
      setMessage('Terjadi kesalahan saat mengunggah.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) {
      if (f.type === 'application/pdf') setFile(f);
      else { setMessage('Hanya file PDF yang diperbolehkan.'); setMessageType('error'); }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = documents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(documents.length / itemsPerPage);

  return (
    <div className="max-w-none space-y-6 lg:space-y-10 pb-12">

      {/* Header Badge */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border ${config.accentClass}`}
      >
        <DocIcon className="w-5 h-5 flex-shrink-0" />
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Dokumen Penunjang Penelitian</p>
          <p className="text-sm font-black uppercase tracking-tight">{config.label}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] font-bold opacity-70 uppercase tracking-widest">
          <Info className="w-3.5 h-3.5" />
          {config.description.split('.')[0]}
        </div>
      </motion.div>

      {/* Stats */}
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
                <div className="h-6 w-12 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded mt-1" />
              ) : (
                <p className="text-xl lg:text-2xl font-black text-gray-900 dark:text-zinc-100 mt-0.5">{item.value}</p>
              )}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Upload Form */}
      <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="px-6 lg:px-8 py-5 lg:py-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${config.accentClass}`}>
              <DocIcon className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight uppercase">
              Unggah {config.label}
            </h3>
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
          <form onSubmit={handleUpload} className="lg:col-span-2 space-y-6">
            {/* Judul */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                Judul {config.label}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100"
                  placeholder={`Masukkan judul ${config.label.toLowerCase()}...`}
                />
                {title.length > 3 && !duplicateFound && (
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
                        Dokumen ini sudah terhitung dalam poin KPI. Pengunggahan dibatasi untuk menghindari duplikasi.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Kategori (readonly) + Tanggal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                  Kategori Dokumen
                </label>
                <div className={`w-full px-4 py-3 rounded-xl border-2 font-black text-sm flex items-center gap-2 ${config.accentClass}`}>
                  <DocIcon className="w-4 h-4 flex-shrink-0" />
                  {config.category}
                  {!isWeightsLoading && categoryWeight && (
                    <span className="ml-auto text-[10px] font-black opacity-70">
                      +{categoryWeight.weight_value} PTS
                    </span>
                  )}
                </div>
              </div>

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
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                File Dokumen (PDF)
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('res-doc-file-upload')?.click()}
                className={`relative group mt-1 flex justify-center px-6 py-10 border-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                  isDragging
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-8 ring-primary-500/10 scale-[1.01]'
                    : file
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-gray-200 dark:border-zinc-800 border-dashed bg-gray-50/30 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-800 hover:border-primary-400 hover:shadow-2xl hover:shadow-primary-500/10'
                }`}
              >
                <input
                  id="res-doc-file-upload"
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div className="space-y-4 text-center">
                  <div className={`mx-auto h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isDragging ? 'scale-110 bg-primary-600' :
                    file ? 'bg-emerald-100 dark:bg-emerald-900/40 shadow-sm' : 'bg-white dark:bg-zinc-800 shadow-sm ring-1 ring-black/5 dark:ring-white/5 group-hover:ring-primary-200'
                  }`}>
                    {file ? (
                      <CheckCircle className="h-8 w-8 text-emerald-600 animate-bounce" />
                    ) : (
                      <Upload className={`h-8 w-8 transition-colors ${isDragging ? 'text-white' : 'text-gray-400 dark:text-zinc-400 group-hover:text-primary-600'}`} />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className={`text-base font-black transition-colors ${file ? 'text-emerald-900 dark:text-emerald-200' : 'text-gray-900 dark:text-zinc-100'}`}>
                      {file ? 'Dokumen Tersegmentasi!' : 'Metode Drag & Drop'}
                    </p>
                    <p className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                      {file ? file.name : 'Klik area ini atau jatuhkan file PDF Anda'}
                    </p>
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
                {loading ? 'Processing...' : `Submit ${config.label}`}
                {!loading && <Zap className="w-4 h-4 ml-2 fill-white" />}
              </button>
            </div>
          </form>

          {/* Info Panel */}
          <div className="space-y-4">
            <div className={`border rounded-2xl p-5 ${config.accentClass}`}>
              <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-current border-opacity-20">
                <Info className="w-4 h-4 flex-shrink-0" />
                <h4 className="text-[11px] font-black uppercase tracking-widest">Tentang {config.label}</h4>
              </div>
              <p className="text-xs font-bold leading-relaxed opacity-80">{config.description}</p>
            </div>

            {!isWeightsLoading && categoryWeight && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50/50 dark:bg-zinc-800/20 border border-gray-100 dark:border-zinc-800/60 rounded-2xl p-5"
              >
                <div className="flex items-center gap-2 mb-3 border-b border-gray-100/80 dark:border-zinc-800 pb-2.5">
                  <div className="p-1.5 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                    <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-zinc-200">Poin KPI</h4>
                </div>
                <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-50 dark:border-zinc-800">
                  <span className="text-[10px] font-bold text-gray-600 dark:text-zinc-300 uppercase tracking-wide">{config.category}</span>
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                    +{categoryWeight.weight_value} PTS
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
          <h3 className="text-lg lg:text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight uppercase">
            Riwayat {config.label}
          </h3>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-50 dark:divide-zinc-800">
            <thead className="bg-gray-50/30 dark:bg-zinc-800/30">
              <tr>
                <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Judul Dokumen</th>
                <th className="hidden md:table-cell px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Tahun</th>
                <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Status</th>
                <th className="px-4 lg:px-8 py-4 text-right text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Poin</th>
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
                    <td className="hidden md:table-cell px-4 lg:px-8 py-4"><div className="h-4 w-20 bg-gray-200 dark:bg-zinc-700 rounded" /></td>
                    <td className="px-4 lg:px-8 py-4"><div className="h-6 w-20 bg-gray-200 dark:bg-zinc-700 rounded-xl" /></td>
                    <td className="px-4 lg:px-8 py-4 flex justify-end"><div className="h-6 w-12 bg-gray-200 dark:bg-zinc-700 rounded-lg" /></td>
                  </tr>
                ))
              ) : currentDocuments.length > 0 ? (
                currentDocuments.map((doc: any) => (
                  <tr key={doc.id} className="hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-colors group">
                    <td className="px-4 lg:px-8 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors shrink-0">
                          <DocIcon className="h-4 w-4 text-gray-400 dark:text-zinc-500 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                        </div>
                        <div className="min-w-0 flex-1 max-w-[200px] sm:max-w-sm">
                          <p className="text-xs lg:text-sm font-extrabold text-gray-900 dark:text-zinc-100 truncate tracking-tight uppercase" title={doc.title}>{doc.title}</p>
                          <p className="text-[9px] lg:text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate mt-0.5">
                            <span className="md:hidden">{doc.published_at ? new Date(doc.published_at).getFullYear() : '-'} • </span>
                            {doc.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="hidden md:table-cell px-4 lg:px-8 py-4 align-middle text-xs font-black text-gray-500 dark:text-zinc-400 font-mono italic">
                      {doc.published_at ? new Date(doc.published_at).getFullYear() : '-'}
                    </td>

                    <td className="px-4 lg:px-8 py-4 align-middle">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                        doc.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' :
                        doc.status === 'Rejected' ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30' :
                        doc.status === 'Verified by Prodi' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30' :
                        'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30'
                      }`}>
                        {doc.status === 'Approved' && <CheckCircle className="w-3 h-3 mr-1.5" />}
                        {doc.status === 'Rejected' && <XCircle className="w-3 h-3 mr-1.5" />}
                        {(doc.status === 'Pending' || doc.status === 'Verified by Prodi') && <Clock className="w-3 h-3 mr-1.5" />}
                        {doc.status === 'Verified by Prodi' ? 'Verified (Prodi)' : doc.status}
                      </div>
                    </td>

                    <td className="px-4 lg:px-8 py-4 align-middle text-right">
                      <span className="text-sm font-black text-primary-600 dark:text-primary-400">
                        +{doc.awarded_points} <span className="text-xs font-bold text-gray-400">PTS</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <DocIcon className="w-12 h-12 text-gray-200 dark:text-zinc-700 mb-4" />
                      <p className="text-sm font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest italic">
                        Belum ada {config.label.toLowerCase()} yang diunggah.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isTableLoading && documents.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-5 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/10 flex items-center justify-between gap-4"
          >
            <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, documents.length)} of {documents.length} entries
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-2 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, index, array) => (
                  <React.Fragment key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="px-2 text-gray-300 dark:text-zinc-600 font-bold">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-[36px] h-9 flex items-center justify-center rounded-xl text-xs font-black transition-all ${
                        currentPage === p
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/30'
                          : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border border-gray-100 dark:border-zinc-800 hover:text-primary-600'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-2 rounded-xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
}
