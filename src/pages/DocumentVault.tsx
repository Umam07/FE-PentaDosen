import React, { useState, useEffect, useMemo } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Clock, CalendarDays, Shield, Archive, Award, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DocumentVault({ user }: { user: any }) {
  const [documents, setDocuments] = useState([]);
  const [weights, setWeights] = useState([]);
  const [kpiPeriod, setKpiPeriod] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [docType, setDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [file, setFile] = useState<File | null>(null);
  
  // State khusus untuk skeleton tabel
  const [isTableLoading, setIsTableLoading] = useState(true);
  
  // State untuk form upload
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchWeights();
    fetchPeriod();

    const loadDocuments = async () => {
      setIsTableLoading(true);
      await fetchDocuments();
      setIsTableLoading(false);
    };

    loadDocuments();
  }, []);

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
    try {
      const res = await fetch('/api/weights');
      const data = await res.json();
      setWeights(data.weights);
      if (data.weights.length > 0 && !category) {
        setCategory(data.weights[0].category);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPeriod = async () => {
    try {
      const res = await fetch('/api/accreditation-periods');
      const data = await res.json();
      setKpiPeriod(data.kpi_period);
    } catch (err) {
      console.error(err);
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

    if (!publishedAt || !kpiPeriod) return null;

    const pubDate = new Date(publishedAt);
    const startDate = new Date(kpiPeriod.start);
    const endDate = new Date(kpiPeriod.end);

    const selectedWeight = weights.find((w: any) => w.category === category);
    const pts = selectedWeight ? (selectedWeight as any).weight_value : 0;

    if (pubDate >= startDate && pubDate <= endDate) {
      return {
        type: 'kpi' as const,
        message: `Masuk Periode KPI Aktif ${kpiPeriod.label}: +${pts} Poin`,
        points: pts,
      };
    } else {
      return {
        type: 'outside' as const,
        message: `Luar Periode KPI ${kpiPeriod.label}: Tersimpan sebagai Arsip (0 Poin)`,
        points: 0,
      };
    }
  }, [publishedAt, docType, category, kpiPeriod, weights]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !category || !publishedAt) {
      setMessage('Harap lengkapi semua field.');
      setMessageType('error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('user_id', user.id);
    formData.append('published_at', publishedAt);
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
        setPublishedAt('');
        
        setIsTableLoading(true);
        await fetchDocuments();
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

  return (
    <div className="max-w-6xl mx-auto space-y-6 lg:space-y-10 pb-12">
      {/* Upload Form Section */}
      <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="px-6 lg:px-8 py-5 lg:py-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight uppercase">Unggah Dokumen Baru</h3>
          
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

        <div className="p-6 lg:p-8">
          <form onSubmit={handleUpload} className="space-y-8">
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
                  Judul Dokumen
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
                  {docType === 'kpi' && title.length > 3 && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-[10px] font-bold text-primary-500 flex items-center bg-primary-50 px-2 py-1 rounded-lg w-fit"
                    >
                      <Zap className="w-3 h-3 mr-1.5 fill-current" />
                      Auto-Verification Enabled
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                  Kategori Dokumen
                </label>
                <select
                  id="category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100 appearance-none cursor-pointer"
                >
                  {weights.map((w: any) => (
                    <option key={w.category} value={w.category} className="dark:bg-zinc-900">
                      {w.category} (+{w.weight_value} PTS)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="published_at" className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center">
                  <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary-500" />
                  Tanggal Terbit
                </label>
                <input
                  type="date"
                  id="published_at"
                  required
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all outline-none text-sm text-gray-900 dark:text-zinc-100"
                />
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
                      : scoringPreview.type === 'outside'
                        ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 text-amber-800 dark:text-amber-400'
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
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center py-4 px-10 border border-transparent shadow-xl shadow-primary-200 dark:shadow-primary-900/30 text-sm font-black rounded-2xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all uppercase tracking-widest disabled:opacity-50 active:scale-95"
              >
                {loading ? 'Processing...' : 'Submit Document'}
                {!loading && <Zap className="w-4 h-4 ml-2 fill-white" />}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Document History Table - FULLY RESPONSIVE */}
      <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
          <h3 className="text-lg lg:text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight uppercase">Riwayat Dokumen</h3>
        </div>
        
        {/* Kontainer tabel dibiarkan w-full tanpa memaksakan whitespace-nowrap agar bisa menyesuaikan flex child-nya */}
        <div className="w-full">
          <table className="min-w-full divide-y divide-gray-50 dark:divide-zinc-800">
            <thead className="bg-gray-50/30 dark:bg-zinc-800/30">
              <tr>
                <th className="px-4 lg:px-8 py-4 text-left text-[9px] lg:text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Informasi Dokumen</th>
                <th className="hidden lg:table-cell px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Kategori</th>
                <th className="hidden md:table-cell px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Tgl. Terbit</th>
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
              ) : documents.length > 0 ? (
                // 🔹 DOKUMEN ASLI (RESPONSIVE) 🔹
                documents.map((doc: any) => (
                  <tr key={doc.id} className="hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-colors group">
                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors shrink-0">
                          <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 dark:text-zinc-500 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                        </div>
                        <div className="min-w-0 flex-1 max-w-[130px] sm:max-w-[200px] lg:max-w-xs">
                          <p className="text-[11px] sm:text-xs lg:text-sm font-extrabold text-gray-900 dark:text-zinc-100 truncate tracking-tight uppercase" title={doc.title}>{doc.title}</p>
                          <p className="text-[9px] lg:text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate mt-0.5" title={doc.category}>
                            {/* Di Mobile (<lg), tanggal ikut ditampilkan di bawah judul agar tetap terlihat */}
                            <span className="lg:hidden">{doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID') : '-'} • </span>
                            {doc.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Disembunyikan pada layar kurang dari Desktop (LG) */}
                    <td className="hidden lg:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      <span className="text-xs font-bold text-gray-600 dark:text-zinc-300 uppercase tracking-wide truncate max-w-[150px] block" title={doc.category}>{doc.category}</span>
                    </td>
                    
                    {/* Disembunyikan pada layar kurang dari Tablet (MD) */}
                    <td className="hidden md:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle text-xs font-black text-gray-500 dark:text-zinc-400 font-mono tracking-tighter italic">
                      {doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID') : '-'}
                    </td>
                    
                    {/* Muncul di semua layar, teks disingkat di mobile */}
                    <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      <div className={`inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-xl font-black text-[9px] lg:text-[10px] uppercase tracking-widest ${
                        doc.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-900/30' :
                        doc.status === 'Rejected' ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 shadow-sm border border-red-100 dark:border-red-900/30' :
                        'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 shadow-sm border border-amber-100 dark:border-amber-900/30'
                      }`}>
                        {doc.status === 'Approved' && <CheckCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 lg:mr-1.5" />}
                        {doc.status === 'Rejected' && <XCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 lg:mr-1.5" />}
                        {doc.status === 'Pending' && <Clock className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 lg:mr-1.5" />}
                        <span className="hidden sm:inline">{doc.status}</span>
                        {/* Singkat nama status di HP biar muat */}
                        <span className="sm:hidden">{doc.status === 'Approved' ? 'OK' : doc.status === 'Rejected' ? 'NO' : 'Wait'}</span>
                      </div>
                    </td>
                    
                    {/* Disembunyikan pada layar ukuran HP (SM) */}
                    <td className="hidden sm:table-cell px-4 lg:px-8 py-4 lg:py-5 align-middle">
                      {doc.is_kpi_counted ? (
                        <div className="inline-flex items-center gap-1.5 lg:gap-2 text-[9px] lg:text-[10px] font-black uppercase text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 lg:px-3 py-1 lg:py-1.5 rounded-xl border border-primary-100 dark:border-primary-900/30 shadow-sm">
                          <Award className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                          KPI <span className="hidden lg:inline">{doc.accreditation_period}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 lg:gap-2 text-[9px] lg:text-[10px] font-black uppercase text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 px-2 lg:px-3 py-1 lg:py-1.5 rounded-xl border border-gray-100 dark:border-zinc-700">
                          <Archive className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                          Arsip
                        </div>
                      )}
                    </td>
                    
                    {/* Muncul di semua layar tapi posisinya menyesuaikan */}
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
      </section>
    </div>
  );
}