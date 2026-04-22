import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Upload, FileText, CheckCircle, XCircle, Clock, 
  CalendarDays, Award, Zap, ChevronLeft, ChevronRight,
  Landmark, Globe, Home, DollarSign, Beaker, ChevronDown,
  PieChart as PieChartIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, PieChart as ReChartsPie, Pie, Cell, Tooltip as RechartsTooltip } from 'recharts';

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
      pending: researchList.filter((d: any) => d.status === 'Pending' || d.status === 'Verified by Prodi').length,
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
        
        setIsTableLoading(true);
        await fetchResearch();
        setCurrentPage(1);
        setIsTableLoading(false);
      } else {
        setMessage(data.message || 'Gagal mengunggah penelitian.');
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

      {/* Upload Form Section */}
      <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="px-6 lg:px-8 py-5 lg:py-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight uppercase">Input Hasil Penelitian</h3>
          
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'hibah internal', label: 'Internal Institusi', icon: Home, color: 'blue', pts: 40 },
                { id: 'hibah dikti', label: 'Eksternal (Dikti)', icon: Landmark, color: 'emerald', pts: 50 },
                { id: 'hibah luar negeri', label: 'Luar Negeri', icon: Globe, color: 'purple', pts: 60 },
              ].map((prog) => (
                <motion.button
                  key={prog.id}
                  type="button"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setProgram(prog.id)}
                  className={`group relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ${
                    program === prog.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-4 ring-primary-500/10 shadow-md'
                      : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-gray-200 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                    program === prog.id 
                      ? 'bg-primary-100 dark:bg-primary-900/40 scale-110' 
                      : 'bg-gray-100 dark:bg-zinc-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/30'
                  }`}>
                    <prog.icon className={`w-5 h-5 transition-colors ${program === prog.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-primary-500'}`} />
                  </div>
                  <p className={`text-[10px] sm:text-xs font-black uppercase text-center tracking-tight ${program === prog.id ? 'text-primary-900 dark:text-primary-100' : 'text-gray-500 dark:text-zinc-400 group-hover:text-gray-900 dark:group-hover:text-zinc-200'}`}>
                    {prog.label}
                  </p>
                  <p className={`text-[9px] font-bold mt-1.5 transition-colors ${program === prog.id ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-400'}`}>{prog.pts} Poin</p>
                  
                  <AnimatePresence>
                    {program === prog.id && (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                  Judul Penelitian
                </label>
                <input
                  type="text"
                  required
                  value={judulPenelitian}
                  onChange={(e) => setJudulPenelitian(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm"
                  placeholder="Contoh: Analisis AI untuk Sistem Pendidikan Tinggi..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center">
                  <DollarSign className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                  Dana Disetujui (Rupiah)
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 tracking-widest">RP</div>
                  <input
                    type="text"
                    required
                    value={danaDisetujui}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (val === '') {
                        setDanaDisetujui('');
                      } else {
                        const formatted = new Intl.NumberFormat('id-ID').format(Number(val));
                        setDanaDisetujui(formatted);
                      }
                    }}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm"
                    placeholder="Contoh: 10.000.000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                  Skema Penelitian
                </label>
                <div className="relative">
                  <select
                    required
                    value={skema}
                    onChange={(e) => setSkema(e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm appearance-none cursor-pointer ${!skema ? 'text-gray-400' : 'text-gray-900 dark:text-zinc-100'}`}
                  >
                    <option value="" disabled hidden>Pilih Skema Penelitian...</option>
                    <option value="kompetisi" className="text-gray-900 dark:text-zinc-100 font-bold">Kompetisi</option>
                    <option value="pembinaan" className="text-gray-900 dark:text-zinc-100 font-bold">Pembinaan</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                  Fokus Penelitian
                </label>
                <div className="relative">
                  <select
                    required
                    value={fokus}
                    onChange={(e) => setFokus(e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm appearance-none cursor-pointer ${!fokus ? 'text-gray-400' : 'text-gray-900 dark:text-zinc-100'}`}
                  >
                    <option value="" disabled hidden>Pilih Fokus Penelitian...</option>
                    <option value="kesehatan" className="text-gray-900 dark:text-zinc-100 font-bold">Kesehatan</option>
                    <option value="ekonomi" className="text-gray-900 dark:text-zinc-100 font-bold">Ekonomi</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2 relative">
                <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1 flex items-center">
                  <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
                  Tahun Penelitian
                </label>
                
                <button
                  type="button"
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  className="w-full px-4 py-3 bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-xl font-bold focus:bg-white dark:focus:bg-zinc-800 focus:ring-4 focus:ring-primary-100 transition-all outline-none text-sm text-left flex justify-between items-center"
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

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
                  Dokumen Hasil Penelitian (PDF)
                </label>
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className={`relative group mt-1 flex justify-center px-6 py-8 border-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                    isDragging 
                      ? 'border-primary-500 bg-primary-50 ring-8 ring-primary-500/10 scale-[1.01]' 
                      : file 
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/10' 
                        : 'border-gray-200 dark:border-zinc-800 border-dashed bg-gray-50/30 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-800 hover:border-primary-400'
                  }`}
                >
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    className="sr-only"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <div className="space-y-3 text-center">
                    <div className={`mx-auto h-12 w-12 rounded-xl flex items-center justify-center transition-all ${
                      file ? 'bg-emerald-100 text-emerald-600' : 'bg-white dark:bg-zinc-800 text-gray-400 group-hover:text-primary-600 shadow-sm'
                    }`}>
                      {file ? <CheckCircle className="h-6 w-6 animate-bounce" /> : <Upload className="h-6 w-6" />}
                    </div>
                    <div>
                      <p className={`text-sm font-black ${file ? 'text-emerald-900' : 'text-gray-900 dark:text-zinc-100'}`}>
                        {file ? 'File Terpilih' : 'Upload PDF (Maks 10MB)'}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        {file ? file.name : 'Seret file ke sini atau klik'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4 border-t border-gray-50 dark:border-zinc-800">
               {scoringPreview ? (
                 <div className="flex items-center gap-4 bg-primary-50 dark:bg-primary-950/20 px-5 py-3 rounded-2xl border border-primary-100 dark:border-primary-900/30">
                    <div className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm font-black text-primary-600 text-xs">
                      {scoringPreview.total}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-primary-700/60 tracking-widest leading-none mb-1">Estimated Points</p>
                      <p className="text-xs font-black text-primary-900 dark:text-primary-100">{scoringPreview.message}</p>
                    </div>
                 </div>
               ) : <div />}

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center py-4 px-10 shadow-xl shadow-primary-200 dark:shadow-primary-900/30 text-sm font-black rounded-2xl text-white bg-primary-600 hover:bg-primary-700 transition-all uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Submit Penelitian'}
                {!loading && <Zap className="w-4 h-4 ml-2 fill-white" />}
              </button>
            </div>
          </form>

          <div className="space-y-6">
            <div className="bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-zinc-800 pb-3">
                <Award className="w-4 h-4 text-primary-600" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-zinc-200">Rule Poin Penelitian</h4>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Hibah Luar Negeri', pts: 60 },
                  { label: 'Hibah Eksternal', pts: 50 },
                  { label: 'Hibah Internal', pts: 40 },
                  { label: 'Dana Penelitian', pts: '0.05 / Juta' }
                ].map(r => (
                  <div key={r.label} className="flex justify-between items-center bg-white dark:bg-zinc-900 p-3 rounded-xl border border-gray-50 dark:border-zinc-800 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-600 dark:text-zinc-400 uppercase">{r.label}</span>
                    <span className="text-[10px] font-black text-primary-600">{r.pts} {typeof r.pts === 'number' && 'PTS'}</span>
                  </div>
                ))}
              </div>
            </div>

            {researchList.length > 0 && programStats.length > 0 && (
              <div className="bg-gray-50/50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 dark:border-zinc-800 pb-3">
                  <PieChartIcon className="w-4 h-4 text-primary-600" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Distribusi Program</h4>
                </div>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReChartsPie>
                      <Pie
                        data={programStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {programStats.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#8B5CF6'][index % 3]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </ReChartsPie>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

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
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Tahun</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Program & Skema</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Dana</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Poin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
              {isTableLoading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4 bg-gray-50/50 h-16"></td>
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
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-black text-gray-600 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">
                        {res.tahun}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-black text-gray-700 dark:text-zinc-300 uppercase tracking-wide">{res.program}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-zinc-700">{res.skema}</span>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest bg-gray-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-zinc-700">{res.fokus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-emerald-600 tabular-nums">
                      {formatCurrency(res.dana_disetujui)}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                        res.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        res.status === 'Rejected' ? 'bg-red-50 text-red-700 border border-red-100' :
                        res.status === 'Verified by Prodi' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {res.status === 'Verified by Prodi' ? 'Verified (Prodi)' : res.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-black text-primary-600">+{res.awarded_points}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-bold italic uppercase text-xs tracking-widest">
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
    </div>
  );
}
