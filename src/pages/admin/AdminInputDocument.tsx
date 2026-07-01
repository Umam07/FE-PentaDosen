import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Upload, FileText, CheckCircle, XCircle, Clock, CalendarDays, 
  Shield, Archive, Award, Zap, ChevronDown, Download, 
  FileSpreadsheet, User, Filter, Search, Globe, BookMarked, Beaker,
  AlertCircle, ArrowRight, Home, Landmark, DollarSign, Book, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DatePicker, formatToYYYYMMDD } from '../../components/ui/DatePicker';

export default function AdminInputDocument() {
  const { user: adminUser } = useOutletContext<{ user: any }>();
  const [users, setUsers] = useState<any[]>([]);
  const [weights, setWeights] = useState<any[]>([]);
  
  // Form States
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [title, setTitle] = useState('');
  const [mainCategory, setMainCategory] = useState('Penelitian');
  const [isMainCategoryDropdownOpen, setIsMainCategoryDropdownOpen] = useState(false);
  const [subCategory, setSubCategory] = useState('');
  const [dateVal, setDateVal] = useState<Date | undefined>(new Date());
  const [docType, setDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [file, setFile] = useState<File | null>(null);

  // Penelitian Specific States
  const [danaDisetujui, setDanaDisetujui] = useState('');
  const [fokus, setFokus] = useState('kesehatan');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchWeights();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/lecturers?role=${adminUser?.role}&user_id=${adminUser?.id}`);
      const data = await res.json();
      setUsers(data.lecturers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingUsers(false);
    }
  };

  const fetchWeights = async () => {
    try {
      const res = await fetch('/api/weights');
      const data = await res.json();
      setWeights(data.weights || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.fakultas && u.fakultas.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [users, searchTerm]);

  const mainCategories = [
    { id: 'Penelitian', label: 'Penelitian', icon: Beaker },
    { id: 'HKI', label: 'HKI', icon: Shield },
    { id: 'Buku', label: 'Buku', icon: Book },
    { id: 'Jurnal Internasional', label: 'Jurnal Internasional', icon: Globe },
    { id: 'Jurnal Nasional', label: 'Jurnal Nasional', icon: BookMarked },
  ];

  // Hardcoded sub-categories to match lecturer pages
  const subCategoryOptions = useMemo(() => {
    if (mainCategory === 'HKI') {
      return [
        { id: 'HKI Paten', label: 'Paten', pts: 40, icon: Award },
        { id: 'HKI Paten Sederhana', label: 'Paten Sederhana', pts: 28, icon: Zap },
        { id: 'HKI Merk', label: 'Merk', pts: 12, icon: Shield },
        { id: 'HKI Hak Cipta', label: 'Hak Cipta', pts: 5, icon: FileText },
      ];
    }
    if (mainCategory === 'Penelitian') {
      return [
        { id: 'hibah internal', label: 'Internal Institusi', pts: 3, icon: Home },
        { id: 'hibah dikti', label: 'Eksternal (Dikti)', pts: 6, icon: Landmark },
        { id: 'hibah luar negeri', label: 'Luar Negeri', pts: 10, icon: Globe },
      ];
    }
    if (mainCategory === 'Buku') {
      return [
        { id: 'Buku Referensi', label: 'Buku Referensi', pts: 40, icon: Book },
        { id: 'Buku Ajar', label: 'Buku Ajar', pts: 20, icon: Book },
        { id: 'Buku Monograf', label: 'Buku Monograf', pts: 20, icon: Book },
      ];
    }
    // For Journals, pull from weights
    return weights
      .filter(w => w.category.toLowerCase().includes(mainCategory.toLowerCase()))
      .map(w => ({
        id: w.category,
        label: w.category,
        pts: w.weight_value,
        icon: mainCategory === 'Jurnal Internasional' ? Globe : BookMarked
      }));
  }, [mainCategory, weights]);

  useEffect(() => {
    if (subCategoryOptions.length > 0) {
      setSubCategory(subCategoryOptions[0].id);
    } else {
      setSubCategory('');
    }
  }, [subCategoryOptions]);

  const scoringPreview = useMemo(() => {
    if (mainCategory === 'Penelitian') {
      const selectedOption = subCategoryOptions.find(opt => opt.id === subCategory);
      const basePoints = selectedOption ? selectedOption.pts : 0;
      return {
        message: `Estimasi: +${basePoints} Poin KPI (Hibah)`,
        points: basePoints
      };
    }
    if (docType === 'arsip') return { message: 'Arsip (0 Poin)', points: 0 };

    const selectedOption = subCategoryOptions.find(opt => opt.id === subCategory);
    const pts = selectedOption ? selectedOption.pts : 0;
    return {
      message: `Estimasi: +${pts} Poin KPI`,
      points: pts
    };
  }, [mainCategory, subCategory, subCategoryOptions, docType]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !file || !title || !mainCategory || !dateVal) {
      setMessage('Harap lengkapi semua field.');
      setMessageType('error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', selectedUserId);
    formData.append('status', 'Approved'); // Admin input is auto-approved

    let endpoint = '/api/documents';

    if (mainCategory === 'Penelitian') {
      endpoint = '/api/penelitian';
      formData.append('judul_penelitian', title);
      formData.append('dana_disetujui', danaDisetujui.replace(/\D/g, ''));
      formData.append('program', subCategory);
      formData.append('skema', 'kompetisi'); // Default value as it's removed from UI
      formData.append('fokus', fokus);
      formData.append('tahun', dateVal ? formatToYYYYMMDD(dateVal) : '');
    } else {
      formData.append('title', title);
      formData.append('category', subCategory);
      formData.append('published_at', dateVal ? formatToYYYYMMDD(dateVal) : '');
      formData.append('doc_type', docType);
    }

    try {
      setLoading(true);
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Dokumen/Penelitian dosen berhasil diinput dan disetujui otomatis!');
        setMessageType('success');
        setTitle('');
        setFile(null);
        setDanaDisetujui('');
        setDateVal(new Date());
      } else {
        setMessage(data.message || 'Gagal menginput data.');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan saat menginput.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const selectedMainCategory = mainCategories.find(c => c.id === mainCategory);

  return (
    <div className="max-w-none space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Input Data Dosen</h1>
          <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Bantu Dosen Menginput Dokumen
          </p>
        </div>
      </div>

      <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="p-8 lg:p-12">
          <form onSubmit={handleUpload} className="space-y-10">
            {/* Step 1: Pilih Dosen */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-600">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Pilih Dosen</h3>
              </div>
              <div className="relative">
                <div 
                  className={`flex items-center gap-3 w-full px-6 py-4 bg-gray-50 dark:bg-zinc-800 border-2 rounded-2xl transition-all ${isDropdownOpen ? 'border-primary-500 ring-4 ring-primary-100 dark:ring-primary-900/20' : 'border-gray-200 dark:border-zinc-700'}`}
                >
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ketik nama dosen atau fakultas..."
                    value={searchTerm}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                      if (selectedUserId) setSelectedUserId('');
                    }}
                    className="w-full bg-transparent outline-none text-sm font-bold text-gray-700 dark:text-zinc-200"
                  />
                  {selectedUserId && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 text-[10px] font-black uppercase">
                      Terpilih
                    </div>
                  )}
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute z-[50] left-0 right-0 mt-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[2rem] shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto scrollbar-hide"
                    >
                      {fetchingUsers ? (
                         <div className="p-10 text-center text-gray-400">
                           <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                           <p className="text-[10px] font-black uppercase tracking-widest">Loading Users...</p>
                         </div>
                      ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => {
                              setSelectedUserId(u.id);
                              setSearchTerm(u.name);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full px-6 py-4 flex flex-col items-start hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border-b border-gray-50 dark:border-zinc-800 last:border-none"
                          >
                            <span className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{u.name}</span>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">{u.fakultas || 'No Faculty'} • {u.program_studi || 'No Prodi'}</span>
                          </button>
                        ))
                      ) : (
                        <div className="p-10 text-center text-gray-400">
                          <p className="text-xs font-black uppercase tracking-widest">Dosen tidak ditemukan</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                {isDropdownOpen && <div className="fixed inset-0 z-[40]" onClick={() => setIsDropdownOpen(false)} />}
              </div>
            </div>

            {/* Step 2: Form Input */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Detail Data</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Kategori Utama</label>
                    <button
                      type="button"
                      onClick={() => setIsMainCategoryDropdownOpen(!isMainCategoryDropdownOpen)}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-2xl flex items-center justify-between transition-all hover:border-primary-500"
                    >
                      <div className="flex items-center gap-3">
                        {selectedMainCategory?.icon && <selectedMainCategory.icon className="w-5 h-5 text-primary-500" />}
                        <span className="text-sm font-black uppercase tracking-tight text-gray-700 dark:text-zinc-200">{selectedMainCategory?.label}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isMainCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isMainCategoryDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-[45]" onClick={() => setIsMainCategoryDropdownOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-[50] left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
                          >
                            {mainCategories.map((cat) => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  setMainCategory(cat.id);
                                  setIsMainCategoryDropdownOpen(false);
                                }}
                                className={`w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border-b border-gray-50 dark:border-zinc-800 last:border-none ${mainCategory === cat.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                              >
                                <cat.icon className={`w-5 h-5 ${mainCategory === cat.id ? 'text-primary-600' : 'text-gray-400'}`} />
                                <span className={`text-sm font-black uppercase tracking-tight ${mainCategory === cat.id ? 'text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-zinc-400'}`}>{cat.label}</span>
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {subCategoryOptions.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Jenis / Sub-Kategori</label>
                      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                        {subCategoryOptions.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSubCategory(opt.id)}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${subCategory === opt.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}`}
                          >
                            <opt.icon className="w-5 h-5 mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-tight text-center">{opt.label}</span>
                            <div className={`mt-2 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${subCategory === opt.id ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                              +{opt.pts} PTS
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}



                  {mainCategory === 'Penelitian' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Dana Disetujui (IDR)</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-gray-400 tracking-widest">RP</div>
                          <input
                            type="text"
                            required
                            value={danaDisetujui}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '');
                              if (val === '') setDanaDisetujui('');
                              else setDanaDisetujui(new Intl.NumberFormat('id-ID').format(Number(val)));
                            }}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary-100 transition-all"
                            placeholder="Contoh: 10.000.000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Fokus</label>
                        <select
                          value={fokus}
                          onChange={(e) => setFokus(e.target.value)}
                          className="w-full px-4 py-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-bold outline-none appearance-none"
                        >
                          <option value="kesehatan">Kesehatan</option>
                          <option value="ekonomi">Ekonomi</option>
                        </select>
                      </div>
                    </>
                  )}

                  {mainCategory !== 'Penelitian' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Tipe Pengajuan</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setDocType('kpi')}
                          className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${docType === 'kpi' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-100 bg-white text-gray-400'}`}
                        >
                          <Sparkles className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Poin KPI</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDocType('arsip')}
                          className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${docType === 'arsip' ? 'border-gray-400 bg-gray-50 text-gray-600' : 'border-gray-100 bg-white text-gray-400'}`}
                        >
                          <Archive className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Arsip</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Judul {mainCategory === 'Penelitian' ? 'Penelitian' : 'Dokumen'}</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={mainCategory === 'Penelitian' ? "Masukkan judul penelitian..." : "Masukkan judul publikasi..."}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-primary-100 transition-all"
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 flex items-center">
                      <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-primary-500" />
                      Tanggal Terbit / Pelaksanaan
                    </label>
                    <DatePicker date={dateVal} onDateChange={setDateVal} placeholder="Pilih tanggal" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600">
                    <Upload className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Upload File (PDF)</h3>
                </div>

                <div 
                  onClick={() => document.getElementById('admin-file-upload')?.click()}
                  className={`relative h-full min-h-[300px] border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center p-8 transition-all cursor-pointer ${file ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 hover:border-primary-400 hover:bg-gray-50'}`}
                >
                  <input
                    id="admin-file-upload"
                    type="file"
                    accept=".pdf"
                    className="sr-only"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                    {file ? <CheckCircle className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                  </div>
                  <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight text-center">
                    {file ? file.name : 'Klik untuk pilih PDF'}
                  </p>
                  
                  {scoringPreview && (
                    <div className="mt-6 px-6 py-3 bg-white dark:bg-zinc-800 border-2 border-primary-100 dark:border-zinc-700 rounded-2xl shadow-xl">
                       <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest text-center mb-1">Result Preview</p>
                       <p className="text-xs font-black text-gray-700 dark:text-zinc-200 text-center">{scoringPreview.message}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <AnimatePresence>
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest ${messageType === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}
                  >
                    {messageType === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-12 py-5 bg-primary-600 hover:bg-primary-700 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-200 transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3"
              >
                {loading ? 'Processing...' : `Simpan ${mainCategory} Dosen`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
