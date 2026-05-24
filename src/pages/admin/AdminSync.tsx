import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, CheckCircle, AlertCircle, BookOpen, Search, User, 
  GraduationCap, Globe, Users, ChevronRight, X, ChevronLeft,
  ShieldCheck, ArrowRight, Zap, Database, ExternalLink, Filter,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOutletContext } from 'react-router-dom';

export default function AdminSync() {
  const { user } = useOutletContext<{ user: any }>();
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [selectedLecturerId, setSelectedLecturerId] = useState<string>('');
  
  // States related to selected lecturer
  const [scholarId, setScholarId] = useState('');
  const [scholarData, setScholarData] = useState<any>(null);
  
  const [scopusId, setScopusId] = useState('');
  const [scopusData, setScopusData] = useState<any>(null);
  
  const [scholarUser, setScholarUser] = useState<any>(null); // the selected user data
  
  // UI states Scholar
  const [loadingScholar, setLoadingScholar] = useState(false);
  const [checkingInfoScholar, setCheckingInfoScholar] = useState(false);
  const [checkedAuthorScholar, setCheckedAuthorScholar] = useState<any>(null);
  const [messageScholar, setMessageScholar] = useState('');

  // UI states Scopus
  const [loadingScopus, setLoadingScopus] = useState(false);
  const [checkingInfoScopus, setCheckingInfoScopus] = useState(false);
  const [checkedAuthorScopus, setCheckedAuthorScopus] = useState<any>(null);
  const [messageScopus, setMessageScopus] = useState('');

  // States related to global summary table
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFakultas, setSelectedFakultas] = useState('');

  // Sync All States
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0, status: '' });

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch all lecturers on mount
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const res = await fetch(`/api/admin/lecturers?role=${user?.role}&user_id=${user?.id}`);
        const data = await res.json();
        setLecturers(data.lecturers);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLecturers();
  }, []);

  // Fetch specific lecturer data when selected
  useEffect(() => {
    if (!selectedLecturerId) {
      setScholarData(null);
      setScopusData(null);
      setScholarUser(null);
      setScholarId('');
      setScopusId('');
      setMessageScholar('');
      setMessageScopus('');
      setCheckedAuthorScholar(null);
      setCheckedAuthorScopus(null);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoadingScholar(true);
        setLoadingScopus(true);
        const res = await fetch(`/api/users/${selectedLecturerId}`);
        if (res.ok) {
          const data = await res.json();
          setScholarData(data.scholarData);
          setScopusData(data.scopusData);
          setScholarUser(data.user);
          setScholarId(data.user.scholar_id || '');
          setScopusId(data.user.scopus_id || '');
          setMessageScholar('');
          setMessageScopus('');
          setCheckedAuthorScholar(null);
          setCheckedAuthorScopus(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingScholar(false);
        setLoadingScopus(false);
      }
    };

    fetchProfile();
  }, [selectedLecturerId]);

  const handleCheckIdScholar = async () => {
    if (!scholarId) {
      setMessageScholar('Masukkan Google Scholar ID terlebih dahulu.');
      return;
    }
    try {
      setCheckingInfoScholar(true);
      setMessageScholar('');
      setCheckedAuthorScholar(null);
      const res = await fetch(`/api/scholar/check/${scholarId}`);
      if (res.ok) {
        const data = await res.json();
        setCheckedAuthorScholar(data);
        setMessageScholar('Author ditemukan! Silakan verifikasi dan Simpan.');
      } else {
        const errData = await res.json();
        setMessageScholar(`Error: ${errData.error || 'Author tidak ditemukan'}`);
      }
    } catch (err) {
      setMessageScholar('Gagal mengecek Scholar ID.');
    } finally {
      setCheckingInfoScholar(false);
    }
  };

  const handleSaveScholarId = async () => {
    if (!selectedLecturerId) return;
    try {
      setLoadingScholar(true);
      const res = await fetch(`/api/users/${selectedLecturerId}/scholar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholar_id: scholarId }),
      });
      if (res.ok) {
        setMessageScholar('Google Scholar ID berhasil disimpan.');
        setScholarUser({ ...scholarUser, scholar_id: scholarId });
        setCheckedAuthorScholar(null);
        setLecturers(lecturers.map(l => l.id == selectedLecturerId ? { ...l, scholar_id: scholarId } : l));
      }
    } catch (err) {
      setMessageScholar('Gagal menyimpan Scholar ID.');
    } finally {
      setLoadingScholar(false);
    }
  };

  const handleSyncScholar = async () => {
    if (!scholarId) {
      setMessageScholar('Simpan Google Scholar ID terlebih dahulu sebelum sync.');
      return;
    }
    try {
      setLoadingScholar(true);
      setMessageScholar('Sedang menarik data dari Google Scholar...');
      const res = await fetch(`/api/users/${selectedLecturerId}/sync`, {
        method: 'POST',
      });
      if (res.ok) {
        setMessageScholar('Data berhasil disinkronisasi dengan Google Scholar.');
        const profileRes = await fetch(`/api/users/${selectedLecturerId}`);
        const data = await profileRes.json();
        setScholarData(data.scholarData);
        setScholarUser(data.user);
      } else {
        setMessageScholar('Gagal melakukan sinkronisasi data.');
      }
    } catch (err) {
      setMessageScholar('Terjadi kesalahan saat sync data.');
    } finally {
      setLoadingScholar(false);
    }
  };

  const handleCheckIdScopus = async () => {
    if (!scopusId) {
      setMessageScopus('Masukkan Scopus ID terlebih dahulu.');
      return;
    }
    try {
      setCheckingInfoScopus(true);
      setMessageScopus('');
      setCheckedAuthorScopus(null);
      const res = await fetch(`/api/scopus/check/${scopusId}`);
      if (res.ok) {
        const data = await res.json();
        setCheckedAuthorScopus(data);
        setMessageScopus('Author Scopus ditemukan! Silakan verifikasi dan Simpan.');
      } else {
        const errData = await res.json();
        setMessageScopus(`Error: ${errData.error || 'Author tidak ditemukan'}`);
      }
    } catch (err) {
      setMessageScopus('Gagal mengecek Scopus ID.');
    } finally {
      setCheckingInfoScopus(false);
    }
  };

  const handleSaveScopusId = async () => {
    if (!selectedLecturerId) return;
    try {
      setLoadingScopus(true);
      const res = await fetch(`/api/users/${selectedLecturerId}/scopus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scopus_id: scopusId }),
      });
      if (res.ok) {
        setMessageScopus('Scopus ID berhasil disimpan.');
        setScholarUser({ ...scholarUser, scopus_id: scopusId });
        setCheckedAuthorScopus(null);
        setLecturers(lecturers.map(l => l.id == selectedLecturerId ? { ...l, scopus_id: scopusId } : l));
      }
    } catch (err) {
      setMessageScopus('Gagal menyimpan Scopus ID.');
    } finally {
      setLoadingScopus(false);
    }
  };

  const handleSyncAll = async () => {
    try {
      setSyncingAll(true);
      setSyncProgress({ current: 0, total: 0, status: 'Mengambil data...' });
      
      const validLecturers = lecturers.filter((l: any) => l.scholar_id || l.scopus_id);
      setSyncProgress({ current: 0, total: validLecturers.length, status: 'Memulai sinkronisasi...' });
      
      let count = 0;
      for (const lecturer of validLecturers) {
        setSyncProgress({ current: count + 1, total: validLecturers.length, status: `${lecturer.name}` });
        
        if (lecturer.scholar_id) {
          try {
            await fetch(`/api/users/${lecturer.id}/sync`, { method: 'POST' });
          } catch (e) {
            console.error(`Gagal sync Scholar untuk ${lecturer.name}`, e);
          }
        }
        
        if (lecturer.scopus_id) {
          try {
            await fetch(`/api/users/${lecturer.id}/sync-scopus`, { method: 'POST' });
          } catch (e) {
            console.error(`Gagal sync Scopus untuk ${lecturer.name}`, e);
          }
        }
        
        count++;
      }
      
      setSyncProgress({ current: count, total: count, status: 'Selesai!' });
      
      // Log the mass sync action
      try {
        await fetch('/api/admin/activity-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            action: 'Mass Sync',
            description: `Admin melakukan sinkronisasi massal untuk ${validLecturers.length} dosen`
          })
        });
      } catch (e) {
        console.error('Failed to log mass sync', e);
      }

      // Refresh lecturers list
      const res = await fetch(`/api/admin/lecturers?role=${user?.role}&user_id=${user?.id}`);
      const data = await res.json();
      setLecturers(data.lecturers);

      setTimeout(() => setSyncingAll(false), 2000);
      
    } catch (err) {
      console.error(err);
      setSyncProgress({ current: 0, total: 0, status: 'Gagal sinkronisasi' });
      setTimeout(() => setSyncingAll(false), 3000);
    }
  };

  const handleSyncScopus = async () => {
    if (!scopusId) {
      setMessageScopus('Simpan Scopus ID terlebih dahulu sebelum sync.');
      return;
    }
    try {
      setLoadingScopus(true);
      setMessageScopus('Sedang menarik data dari Scopus...');
      const res = await fetch(`/api/users/${selectedLecturerId}/sync-scopus`, {
        method: 'POST',
      });
      if (res.ok) {
        setMessageScopus('Data berhasil disinkronisasi dengan Scopus.');
        const profileRes = await fetch(`/api/users/${selectedLecturerId}`);
        const data = await profileRes.json();
        setScopusData(data.scopusData);
        setScholarUser(data.user);
      } else {
        setMessageScopus('Gagal melakukan sinkronisasi data Scopus.');
      }
    } catch (err) {
      setMessageScopus('Terjadi kesalahan saat sync data Scopus.');
    } finally {
      setLoadingScopus(false);
    }
  };

  const filteredLecturers = lecturers.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (l.email && l.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchFakultas = selectedFakultas ? l.fakultas === selectedFakultas : true;
    return matchSearch && matchFakultas;
  });

  const totalPages = Math.ceil(filteredLecturers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLecturers = filteredLecturers.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFakultas]);

  return (
    <div className="max-w-none space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Sinkronisasi Global</h1>
          <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Otomasi Penarikan Data dari Scholar & Scopus
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
                onClick={handleSyncAll}
                disabled={syncingAll}
                className="w-full md:w-auto flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-2xl shadow-xl shadow-primary-500/20 border border-primary-500 transition-all active:scale-95 text-[11px] font-black uppercase tracking-[0.15em] disabled:opacity-70 disabled:cursor-wait"
            >
              <RefreshCw className={`h-4 w-4 ${syncingAll ? 'animate-spin' : ''}`} />
              {syncingAll ? (
                <span>
                   Syncing ({syncProgress.current}/{syncProgress.total})
                </span>
              ) : 'Jalankan Sinkronisasi Massal'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-3xl border border-gray-50 dark:border-zinc-800 p-6 flex items-center justify-between group transition-all hover:scale-[1.02]">
           <div>
              <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Database Dosen</p>
              <p className="text-3xl font-black text-gray-900 dark:text-zinc-100 mt-1">{lecturers.length}</p>
           </div>
           <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400 border border-primary-100/50 dark:border-primary-900/30">
              <Users className="h-7 w-7" />
           </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-3xl border border-gray-50 dark:border-zinc-800 p-6 flex items-center justify-between group transition-all hover:scale-[1.02]">
           <div>
              <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Scholar Connected</p>
              <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">{lecturers.filter(l => l.scholar_id).length}</p>
           </div>
           <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30">
              <BookOpen className="h-7 w-7" />
           </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-3xl border border-gray-50 dark:border-zinc-800 p-6 flex items-center justify-between group transition-all hover:scale-[1.02]">
           <div>
              <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Scopus Connected</p>
              <p className="text-3xl font-black text-orange-600 dark:text-orange-400 mt-1">{lecturers.filter(l => l.scopus_id).length}</p>
           </div>
           <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl text-orange-600 dark:text-orange-400 border border-orange-100/50 dark:border-orange-900/30">
              <Globe className="h-7 w-7" />
           </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {scholarUser && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-8"
          >
            {/* Lecturer Management Header */}
            <div className="bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden relative group">
               <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent dark:from-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className="p-8 flex flex-col md:flex-row gap-8 md:items-center justify-between relative z-10">
                  <div className="flex flex-col md:flex-row gap-8 md:items-center">
                    <div className="h-20 w-20 rounded-3xl bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-primary-500/40 transform -rotate-3 group-hover:rotate-0 transition-all duration-500 border-2 border-white/20 overflow-hidden">
                      {scholarData?.thumbnail ? (
                        <img src={scholarData.thumbnail} alt={scholarUser.name} className="w-full h-full object-cover" />
                      ) : (
                        scholarUser.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{scholarUser.name}</h4>
                      <div className="mt-2 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                          <GraduationCap className="h-4 w-4 mr-2 text-primary-500" />
                          {scholarUser.program_studi || 'N/A'}
                        </p>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-primary-500" />
                          {scholarUser.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedLecturerId('')}
                    className="px-6 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-red-200 rounded-2xl text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 group/close"
                  >
                    <X className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Tutup Panel
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* GOOGLE SCHOLAR INTEGRATION */}
              <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-[2rem] border border-blue-50 dark:border-blue-900/20 overflow-hidden">
                <div className="px-8 py-6 border-b border-blue-50 dark:border-blue-900/20 bg-blue-50/20 dark:bg-blue-950/20 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 rounded-xl mr-4 shadow-sm">
                      <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                    <h3 className="text-lg font-black text-blue-900 dark:text-zinc-100 uppercase tracking-tight">Scholar Gateway</h3>
                  </div>
                  {messageScholar && (
                    <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-xl uppercase tracking-widest animate-pulse border border-emerald-100/50">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                      {messageScholar}
                    </motion.span>
                  )}
                </div>
                
                <div className="p-8 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Google Scholar ID</label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"><Zap className="w-4 h-4" /></div>
                         <input
                          type="text"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-100 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/50 text-sm font-bold text-gray-900 dark:text-zinc-100 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner"
                          placeholder="e.g. xxxxxxxAAAAJ"
                          value={scholarId}
                          onChange={(e) => {
                            setScholarId(e.target.value);
                            setCheckedAuthorScholar(null);
                          }}
                        />
                      </div>
                      <button
                        onClick={handleCheckIdScholar}
                        disabled={checkingInfoScholar || !scholarId}
                        className="px-6 py-3.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[10px] font-black text-gray-600 dark:text-zinc-300 uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 shadow-sm"
                      >
                        {checkingInfoScholar ? '...' : 'Cek'}
                      </button>
                    </div>
                    {checkedAuthorScholar && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-4 p-5 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/10 dark:to-zinc-900/50 rounded-2xl border border-blue-100/50 dark:border-blue-900/20 flex items-center gap-5 shadow-sm">
                        {checkedAuthorScholar.thumbnail ? (
                          <img src={checkedAuthorScholar.thumbnail} className="h-16 w-16 rounded-2xl object-cover shadow-md border-2 border-white dark:border-zinc-800" />
                        ) : (
                          <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center"><User className="w-6 h-6 text-blue-400" /></div>
                        )}
                        <div className="flex-1">
                            <h4 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{checkedAuthorScholar.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 leading-relaxed">{checkedAuthorScholar.affiliations}</p>
                            <button onClick={handleSaveScholarId} className="mt-3 text-[10px] font-black text-blue-600 uppercase tracking-[0.15em] hover:text-blue-700 underline flex items-center gap-1.5">Konfirmasi & Simpan <ArrowRight className="w-3.5 h-3.5" /></button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="border-t border-gray-50 dark:border-zinc-800 pt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-[11px] font-black text-gray-900 dark:text-zinc-100 uppercase tracking-[0.2em]">Metrik Performa</h4>
                      <button
                        onClick={handleSyncScholar}
                        disabled={loadingScholar || !scholarUser.scholar_id}
                        className="flex items-center gap-2.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingScholar ? 'animate-spin' : ''}`} />
                        Sync Now
                      </button>
                    </div>

                    {scholarData ? (
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'Citations', val: scholarData.total_citations, color: 'text-blue-600', bg: 'bg-blue-50/50 dark:bg-blue-900/10' },
                          { label: 'H-Index', val: scholarData.h_index, color: 'text-emerald-600', bg: 'bg-emerald-50/50 dark:bg-emerald-900/10' },
                          { label: 'i10-Index', val: scholarData.i10_index, color: 'text-purple-600', bg: 'bg-purple-50/50 dark:bg-purple-900/10' },
                        ].map((s, i) => (
                          <div key={i} className={`${s.bg} p-4 rounded-2xl border border-white/20 dark:border-zinc-800/50 text-center shadow-sm`}>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{s.label}</p>
                            <p className={`text-2xl font-black ${s.color} font-mono tracking-tight`}>{s.val}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border-2 border-dashed border-gray-100 dark:border-zinc-800">
                        <Database className="mx-auto h-8 w-8 text-gray-300 mb-3 opacity-50" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Snapshot Data Tidak Tersedia</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SCOPUS INTEGRATION */}
              <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-[2rem] border border-orange-50 dark:border-orange-900/20 overflow-hidden">
                <div className="px-8 py-6 border-b border-orange-50 dark:border-orange-900/20 bg-orange-50/20 dark:bg-orange-950/20 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="p-2.5 bg-orange-100 dark:bg-orange-900/40 rounded-xl mr-4 shadow-sm">
                      <Globe className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                    </div>
                    <h3 className="text-lg font-black text-orange-900 dark:text-zinc-100 uppercase tracking-tight">Scopus Node</h3>
                  </div>
                  {messageScopus && (
                    <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-xl uppercase tracking-widest animate-pulse border border-emerald-100/50">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                      {messageScopus}
                    </motion.span>
                  )}
                </div>
                
                <div className="p-8 space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Scopus Author ID</label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"><Zap className="w-4 h-4" /></div>
                         <input
                          type="text"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-100 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/50 text-sm font-bold text-gray-900 dark:text-zinc-100 focus:ring-4 focus:ring-orange-100 outline-none transition-all shadow-inner"
                          placeholder="e.g. 57xxxxxxxxx"
                          value={scopusId}
                          onChange={(e) => {
                            setScopusId(e.target.value);
                            setCheckedAuthorScopus(null);
                          }}
                        />
                      </div>
                      <button
                        onClick={handleCheckIdScopus}
                        disabled={checkingInfoScopus || !scopusId}
                        className="px-6 py-3.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[10px] font-black text-gray-600 dark:text-zinc-300 uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 shadow-sm"
                      >
                        {checkingInfoScopus ? '...' : 'Cek'}
                      </button>
                    </div>
                    {checkedAuthorScopus && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-4 p-5 bg-gradient-to-br from-orange-50/50 to-white dark:from-orange-900/10 dark:to-zinc-900/50 rounded-2xl border border-orange-100/50 dark:border-orange-900/20 flex flex-col gap-2 shadow-sm">
                        <h4 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{checkedAuthorScopus.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed">{checkedAuthorScopus.affiliations}</p>
                        <button onClick={handleSaveScopusId} className="mt-2 text-[10px] font-black text-orange-600 uppercase tracking-[0.15em] hover:text-orange-700 underline flex items-center gap-1.5 w-fit">Verifikasi & Link ID <ArrowRight className="w-3.5 h-3.5" /></button>
                      </motion.div>
                    )}
                  </div>

                  <div className="border-t border-gray-50 dark:border-zinc-800 pt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-[11px] font-black text-gray-900 dark:text-zinc-100 uppercase tracking-[0.2em]">Statistik Output</h4>
                      <button
                        onClick={handleSyncScopus}
                        disabled={loadingScopus || !scholarUser.scopus_id}
                        className="flex items-center gap-2.5 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all active:scale-95 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingScopus ? 'animate-spin' : ''}`} />
                        Sync Now
                      </button>
                    </div>

                    {scopusData ? (
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'Documents', val: scopusData.document_count, color: 'text-orange-600', bg: 'bg-orange-50/50 dark:bg-orange-900/10' },
                          { label: 'Citations', val: scopusData.total_citations, color: 'text-sky-600', bg: 'bg-sky-50/50 dark:bg-sky-900/10' },
                          { label: 'H-Index', val: scopusData.h_index, color: 'text-teal-600', bg: 'bg-teal-50/50 dark:bg-teal-900/10' },
                        ].map((s, i) => (
                          <div key={i} className={`${s.bg} p-4 rounded-2xl border border-white/20 dark:border-zinc-800/50 text-center shadow-sm`}>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">{s.label}</p>
                            <p className={`text-2xl font-black ${s.color} font-mono tracking-tight`}>{s.val}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center bg-gray-50/50 dark:bg-zinc-800/30 rounded-2xl border-2 border-dashed border-gray-100 dark:border-zinc-800">
                        <Database className="mx-auto h-8 w-8 text-gray-300 mb-3 opacity-50" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data Scopus Belum Terpetakan</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Integration Tracker */}
      <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_30px_rgba(0,0,0,0.04)] rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="p-8 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/10 backdrop-blur-sm">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4 w-full xl:w-auto">
              <div className="hidden md:flex p-4 bg-primary-50 dark:bg-primary-900/20 rounded-[1.25rem] text-primary-600 dark:text-primary-400 shadow-sm">
                 <Users className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Tracker Kesiapan Data</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Status integrasi sistem eksternal per individu</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <div className="relative w-full xl:w-[400px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Cari nama dosen atau email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 dark:border-zinc-700 rounded-[1.25rem] bg-white dark:bg-zinc-800 text-sm font-bold text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 outline-none transition-all shadow-inner"
                />
              </div>
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
                    <option value="Fakultas Ekonomi Bisnis">Ekonomi Bisnis</option>
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

        <div className="overflow-x-auto scrollbar-hide">
          <table className="min-w-full divide-y divide-gray-50 dark:divide-zinc-800">
            <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
              <tr>
                {['Dosen Peneliti', 'Scholar Status', 'Scopus Status', 'Kendali'].map((h, i) => (
                  <th key={i} className={`px-8 py-5 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em] ${h === 'Kendali' ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
              {currentLecturers.map((l) => (
                <tr key={l.id} className={`group hover:bg-primary-50/30 dark:hover:bg-primary-950/10 transition-all duration-300 ${selectedLecturerId === l.id ? 'bg-primary-50/50 dark:bg-primary-950/20' : ''}`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 font-black text-lg border border-gray-200 dark:border-zinc-700 shadow-inner group-hover:scale-110 transition-transform overflow-hidden">
                        {l.thumbnail ? (
                          <img src={l.thumbnail} alt={l.name} className="w-full h-full object-cover" />
                        ) : (
                          l.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight group-hover:text-primary-600 transition-colors">{l.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 tracking-wider flex items-center gap-2 mt-1 uppercase tracking-widest">
                           <ShieldCheck className="w-3 h-3 text-emerald-500" />
                           {l.email?.split('@')[0]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {l.scholar_id ? (
                      <span className="inline-flex items-center gap-2 text-[10px] font-black text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-900/40 uppercase tracking-tight shadow-sm">
                         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                         Linked Scholar
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-zinc-700 uppercase tracking-tight opacity-50">
                         Not Active
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    {l.scopus_id ? (
                      <span className="inline-flex items-center gap-2 text-[10px] font-black text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-4 py-2 rounded-xl border border-orange-100 dark:border-orange-900/40 uppercase tracking-tight shadow-sm">
                         <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
                         Linked Scopus
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-zinc-700 uppercase tracking-tight opacity-50">
                         Not Active
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                     <button
                       onClick={() => {
                         setSelectedLecturerId(l.id);
                         window.scrollTo({ top: 0, behavior: 'smooth' });
                       }}
                       className="px-6 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-primary-300 rounded-2xl text-[10px] font-black text-gray-500 hover:text-primary-600 uppercase tracking-widest active:scale-95 transition-all shadow-sm flex items-center gap-3 ml-auto group/btn"
                     >
                       Manage <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Global Pagination */}
        {filteredLecturers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-8 py-8 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/10 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <span className="text-[10px] lg:text-[11px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest leading-none">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredLecturers.length)} of {filteredLecturers.length} Users
              </span>
              <div className="h-5 w-px bg-gray-200 dark:bg-zinc-700 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Limit:</span>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl text-xs font-bold py-1 pl-2 pr-6 focus:ring-4 focus:ring-primary-100 outline-none cursor-pointer"
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
                        <span className="px-1 text-gray-300 font-bold">...</span>
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
    </div>
  );
}
