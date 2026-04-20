import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, GraduationCap, BookOpen, BadgeCheck, 
  Settings, RefreshCw, CheckCircle, AlertCircle, 
  ExternalLink, Award, Hash, Globe, ChevronRight,
  ShieldCheck, Search
} from 'lucide-react';

export default function Profile({ user, setUser }: { user: any; setUser: any }) {
  const [scholarId, setScholarId] = useState(user?.scholar_id || '');
  const [scopusId, setScopusId] = useState(user?.scopus_id || '');
  const [scholarData, setScholarData] = useState<any>(null);
  const [scopusData, setScopusData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkingInfo, setCheckingInfo] = useState(false);
  const [checkingScopus, setCheckingScopus] = useState(false);
  const [checkedAuthor, setCheckedAuthor] = useState<any>(null);
  const [checkedScopusAuthor, setCheckedScopusAuthor] = useState<any>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState<'info' | 'integrasi'>('info');

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`/api/users/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setScholarData(data.scholarData);
          setScopusData(data.scopusData);
          setScholarId(data.user.scholar_id || '');
          setScopusId(data.user.scopus_id || '');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfileData();
  }, [user?.id]);

  const handleCheckId = async () => {
    if (!scholarId) {
      setMessage({ text: 'Masukkan Google Scholar ID terlebih dahulu.', type: 'error' });
      return;
    }
    try {
      setCheckingInfo(true);
      setMessage({ text: '', type: '' });
      setCheckedAuthor(null);
      const res = await fetch(`/api/scholar/check/${scholarId}`);
      if (res.ok) {
        const data = await res.json();
        setCheckedAuthor(data);
        setMessage({ text: 'ID ditemukan! Silakan verifikasi dan simpan.', type: 'success' });
      } else {
        const errData = await res.json();
        setMessage({ text: `Error: ${errData.error || 'ID tidak ditemukan'}`, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Gagal mengecek Scholar ID.', type: 'error' });
    } finally {
      setCheckingInfo(false);
    }
  };

  const handleSaveScholarId = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${user.id}/scholar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scholar_id: scholarId }),
      });
      if (res.ok) {
        setMessage({ text: 'Scholar ID berhasil disimpan.', type: 'success' });
        setUser({ ...user, scholar_id: scholarId });
        setCheckedAuthor(null);
      }
    } catch (err) {
      setMessage({ text: 'Gagal menyimpan Scholar ID.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckScopusId = async () => {
    if (!scopusId) {
      setMessage({ text: 'Masukkan Scopus Author ID terlebih dahulu.', type: 'error' });
      return;
    }
    try {
      setCheckingScopus(true);
      setMessage({ text: '', type: '' });
      setCheckedScopusAuthor(null);
      const res = await fetch(`/api/scopus/check/${scopusId}`);
      if (res.ok) {
        const data = await res.json();
        setCheckedScopusAuthor(data);
        setMessage({ text: 'ID Scopus ditemukan! Silakan verifikasi dan simpan.', type: 'success' });
      } else {
        const errData = await res.json();
        setMessage({ text: `Error: ${errData.error || 'ID Scopus tidak ditemukan'}`, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Gagal mengecek Scopus ID.', type: 'error' });
    } finally {
      setCheckingScopus(false);
    }
  };

  const handleSaveScopusId = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${user.id}/scopus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scopus_id: scopusId }),
      });
      if (res.ok) {
        setMessage({ text: 'Scopus ID berhasil disimpan.', type: 'success' });
        setUser({ ...user, scopus_id: scopusId });
        setCheckedScopusAuthor(null);
      }
    } catch (err) {
      setMessage({ text: 'Gagal menyimpan Scopus ID.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!scholarId) {
      setMessage({ text: 'Simpan Google Scholar ID terlebih dahulu.', type: 'error' });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${user.id}/sync`, {
        method: 'POST',
      });
      if (res.ok) {
        setMessage({ text: 'Data Scholar berhasil disinkronisasi.', type: 'success' });
        const profileRes = await fetch(`/api/users/${user.id}`);
        const data = await profileRes.json();
        setScholarData(data.scholarData);
        setUser(data.user);
      } else {
        setMessage({ text: 'Gagal sinkronisasi data Scholar.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Error sinkronisasi data Scholar.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncScopus = async () => {
    if (!scopusId) {
      setMessage({ text: 'Simpan Scopus ID terlebih dahulu.', type: 'error' });
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${user.id}/sync-scopus`, {
        method: 'POST',
      });
      if (res.ok) {
        setMessage({ text: 'Data Scopus berhasil disinkronisasi.', type: 'success' });
        const profileRes = await fetch(`/api/users/${user.id}`);
        const data = await profileRes.json();
        setScopusData(data.scopusData);
        setUser(data.user);
      } else {
        setMessage({ text: 'Gagal sinkronisasi data Scopus.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Error sinkronisasi data Scopus.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Profile - Enhanced Gradient & Glow */}
      <div className="relative mb-12">
        <div className="h-56 lg:h-72 rounded-[2.5rem] bg-gradient-to-br from-primary-600 via-primary-500 to-indigo-700 relative overflow-hidden shadow-2xl shadow-primary-500/20">
          {/* Decorative Animated Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400/30 rounded-full -ml-24 -mb-24 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        </div>
        
        {/* REVISED SECTION: Flex container diperbaiki agar teks turun ke area putih */}
        <div className="px-6 lg:px-12 relative flex flex-col md:flex-row items-start gap-6 md:gap-8">
          
          {/* Avatar - Diberi margin negatif agar naik menimpa banner */}
          <div className="-mt-20 lg:-mt-24 relative group mx-auto md:mx-0 z-20">
            <div className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-[2rem] bg-white dark:bg-zinc-900 p-2.5 shadow-xl border border-white/50 dark:border-zinc-800 relative z-10 transform transition-transform duration-500 group-hover:scale-105">
              <div className="w-full h-full rounded-[1.5rem] bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-white text-5xl lg:text-7xl font-black shadow-inner">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
            {/* Online Status Badge */}
            <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 border-4 border-white dark:border-zinc-900 rounded-full z-20"></div>
          </div>
          
          {/* Teks - Diberi margin top agar sejajar di bawah batas banner */}
          <div className="flex-1 mt-4 md:mt-6 w-full text-center md:text-left flex flex-col justify-center">
            <div className="flex flex-col md:flex-row items-center md:justify-start gap-3">
              <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white tracking-tight drop-shadow-sm">
                {user?.name || 'User Tanpa Nama'}
              </h1>
              <BadgeCheck className="w-8 h-8 text-blue-500 drop-shadow-md" />
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
              <span className="bg-primary-50/80 dark:bg-primary-500/10 backdrop-blur-sm text-primary-700 dark:text-primary-400 border border-primary-200/50 dark:border-primary-500/20 text-[11px] px-4 py-2 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                {user?.role === 'admin lppm' ? 'Admin LPPM' : user?.role === 'admin prodi' ? 'Admin Prodi' : user?.role || 'User'}
              </span>
              <span className="bg-green-50/80 dark:bg-green-500/10 backdrop-blur-sm text-green-700 dark:text-green-400 border border-green-200/50 dark:border-green-500/20 text-[11px] px-4 py-2 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Status Aktif
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation - Floating Effect */}
      <div className="flex items-center gap-2 bg-gray-100/80 dark:bg-zinc-800/80 backdrop-blur-md p-1.5 rounded-2xl mb-10 w-fit mx-auto md:mx-0 border border-gray-200/50 dark:border-zinc-700/50 shadow-sm">
        <button 
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${activeTab === 'info' ? 'bg-white dark:bg-zinc-900 text-primary-600 dark:text-primary-400 shadow-md transform scale-[1.02]' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 hover:bg-gray-200/50 dark:hover:bg-zinc-700/50'}`}
        >
          <User className="w-4 h-4" />
          Detail Informasi
        </button>
        <button 
          onClick={() => setActiveTab('integrasi')}
          className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${activeTab === 'integrasi' ? 'bg-white dark:bg-zinc-900 text-primary-600 dark:text-primary-400 shadow-md transform scale-[1.02]' : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 hover:bg-gray-200/50 dark:hover:bg-zinc-700/50'}`}
        >
          <Globe className="w-4 h-4" />
          Integrasi Publikasi
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Main Content Area */}
        <div className="xl:col-span-2 min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'info' ? (
              <motion.div 
                key="info"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800/60 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-10 uppercase tracking-widest flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-inner">
                      <User className="w-6 h-6" />
                    </div>
                    Profil & Akademik
                  </h3>
                  
                  <div className="space-y-12">
                    {/* Academic Info Section */}
                    <div>
                      <h4 className="text-[11px] font-black text-primary-600/80 dark:text-primary-400/80 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <GraduationCap className="w-4 h-4" /> Informasi Akademik
                        <div className="flex-1 h-px bg-gradient-to-r from-primary-100 dark:from-primary-900/50 to-transparent"></div>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[
                          { label: 'Alamat Email', value: user?.email, icon: Mail, color: 'text-blue-500', bgHover: 'hover:border-blue-200 dark:hover:border-blue-500/30' },
                          { label: 'Fakultas', value: user?.fakultas, icon: BookOpen, color: 'text-purple-500', bgHover: 'hover:border-purple-200 dark:hover:border-purple-500/30' },
                          { label: 'Program Studi', value: user?.program_studi, icon: GraduationCap, color: 'text-orange-500', bgHover: 'hover:border-orange-200 dark:hover:border-orange-500/30' },
                        ].map((item, idx) => (
                          <div key={idx} className={`group p-5 bg-gray-50/80 dark:bg-zinc-800/40 rounded-2xl border border-gray-100 dark:border-zinc-700/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/20 ${item.bgHover}`}>
                            <label className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.15em] mb-3">{item.label}</label>
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm ${item.color}`}>
                                <item.icon className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-bold text-gray-800 dark:text-zinc-200 truncate flex-1">{item.value || '-'}</p>
                            </div>
                          </div>
                        ))}

                        <div className="group p-5 bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 rounded-2xl border border-primary-100/50 dark:border-primary-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/10">
                          <label className="block text-[10px] font-black text-primary-600/70 dark:text-primary-400/70 uppercase tracking-[0.15em) mb-3">Total KPI Points</label>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm text-primary-600 dark:text-primary-400">
                              <Award className="w-5 h-5" />
                            </div>
                            <p className="text-2xl font-black text-primary-700 dark:text-primary-300 font-mono italic">{user?.total_kpi_points || 0}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Publication Identity Section */}
                    <div>
                      <h4 className="text-[11px] font-black text-primary-600/80 dark:text-primary-400/80 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <Globe className="w-4 h-4" /> Identitas Publikasi
                        <div className="flex-1 h-px bg-gradient-to-r from-primary-100 dark:from-primary-900/50 to-transparent"></div>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[
                          { label: 'Google Scholar ID', value: user?.scholar_id, icon: Globe, color: 'text-blue-500' },
                          { label: 'Scopus ID', value: user?.scopus_id, icon: Hash, color: 'text-pink-500' },
                          { label: 'SINTA ID', value: user?.sinta_id, icon: BadgeCheck, color: 'text-green-500' },
                          { label: 'NIDN / NIP', value: user?.nidn || user?.nip, icon: User, color: 'text-indigo-500' },
                        ].map((item, idx) => (
                          <div key={idx} className="group p-5 bg-gray-50/80 dark:bg-zinc-800/40 rounded-2xl border border-gray-100 dark:border-zinc-700/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/20 dark:hover:shadow-black/20 hover:border-gray-200 dark:hover:border-zinc-600">
                            <label className="block text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.15em] mb-3">{item.label}</label>
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center shadow-sm ${item.color}`}>
                                <item.icon className="w-5 h-5" />
                              </div>
                              <p className="text-sm font-bold text-gray-800 dark:text-zinc-200 truncate flex-1">{item.value || 'Belum diatur'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="integrasi"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                {/* Global Message Area */}
                <AnimatePresence>
                  {message.text && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className={`flex items-center gap-3 px-6 py-4 rounded-[1.5rem] text-sm font-bold shadow-lg backdrop-blur-md ${message.type === 'success' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'}`}
                    >
                      {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      {message.text}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Google Scholar Section */}
                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800/60 p-8 sm:p-10 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                        <Globe className="w-6 h-6" />
                      </div>
                      Google Scholar
                    </h3>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-gray-50/50 dark:bg-zinc-800/20 p-6 rounded-[2rem] border border-gray-100 dark:border-zinc-700/50">
                      <label className="block text-[11px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-[0.2em] mb-4">ID Google Scholar</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Contoh: xxxxxxxAAAAJ"
                            value={scholarId}
                            onChange={(e) => {
                              setScholarId(e.target.value);
                              setCheckedAuthor(null);
                            }}
                            className="block w-full pl-6 pr-5 py-4 bg-white dark:bg-zinc-900 border-2 border-transparent ring-1 ring-gray-200 dark:ring-zinc-700 rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 transition-all shadow-sm"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleCheckId}
                            disabled={checkingInfo || !scholarId}
                            className="px-6 py-4 bg-white dark:bg-zinc-800 border ring-1 ring-gray-200 dark:ring-zinc-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center gap-2"
                          >
                            {checkingInfo ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Cek ID'}
                          </button>
                          <button
                            onClick={handleSaveScholarId}
                            disabled={loading || !scholarId || (scholarId !== user.scholar_id && !checkedAuthor)}
                            className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30"
                          >
                            Simpan
                          </button>
                        </div>
                      </div>
                    </div>

                    {checkedAuthor && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl flex items-center gap-6 border border-blue-100 dark:border-blue-500/20">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-sm">
                           {checkedAuthor.thumbnail ? <img src={checkedAuthor.thumbnail} className="w-full h-full object-cover" /> : <User className="w-full h-full p-3 text-gray-300" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider">{checkedAuthor.name}</h4>
                          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 mt-1">{checkedAuthor.affiliations}</p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </motion.div>
                    )}

                    {scholarData ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        {[
                          { label: 'Sitasi', value: scholarData.total_citations, color: 'text-blue-500' },
                          { label: 'H-Index', value: scholarData.h_index, color: 'text-purple-500' },
                          { label: 'i10-Index', value: scholarData.i10_index, color: 'text-orange-500' },
                        ].map((s, i) => (
                          <div key={i} className="bg-gray-50/50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700/50">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                            <p className={`text-2xl font-black ${s.color}`}>{s.value || 0}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                       <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 rounded-2xl border border-amber-200/50 text-xs font-bold">
                         <AlertCircle className="w-4 h-4" /> Belum ada data statistik Scholar. Silakan sync data.
                       </div>
                    )}

                    <button
                      onClick={handleSync}
                      disabled={loading || !scholarId}
                      className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3"
                    >
                      <RefreshCw className={loading ? 'animate-spin' : ''} /> Sync Google Scholar
                    </button>
                  </div>
                </div>

                {/* Scopus Section */}
                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-gray-100 dark:border-zinc-800/60 p-8 sm:p-10 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400 shadow-inner">
                        <Hash className="w-6 h-6" />
                      </div>
                      Scopus
                    </h3>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-gray-50/50 dark:bg-zinc-800/20 p-6 rounded-[2rem] border border-gray-100 dark:border-zinc-700/50">
                      <label className="block text-[11px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-[0.2em] mb-4">Author ID Scopus</label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Contoh: 57211234567"
                            value={scopusId}
                            onChange={(e) => {
                              setScopusId(e.target.value);
                              setCheckedScopusAuthor(null);
                            }}
                            className="block w-full pl-6 pr-5 py-4 bg-white dark:bg-zinc-900 border-2 border-transparent ring-1 ring-gray-200 dark:ring-zinc-700 rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-pink-500 transition-all shadow-sm"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={handleCheckScopusId}
                            disabled={checkingScopus || !scopusId}
                            className="px-6 py-4 bg-white dark:bg-zinc-800 border ring-1 ring-gray-200 dark:ring-zinc-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all disabled:opacity-50 flex items-center gap-2"
                          >
                            {checkingScopus ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Cek ID'}
                          </button>
                          <button
                            onClick={handleSaveScopusId}
                            disabled={loading || !scopusId || (scopusId !== user.scopus_id && !checkedScopusAuthor)}
                            className="px-8 py-4 bg-pink-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-pink-700 transition-all disabled:opacity-50 shadow-lg shadow-pink-500/30"
                          >
                            Simpan
                          </button>
                        </div>
                      </div>
                    </div>

                    {checkedScopusAuthor && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-pink-50 dark:bg-pink-900/10 rounded-3xl flex items-center gap-6 border border-pink-100 dark:border-pink-500/20">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
                           <User className="w-8 h-8 text-pink-300" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-wider">{checkedScopusAuthor.name}</h4>
                          <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 mt-1">{checkedScopusAuthor.affiliations}</p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </motion.div>
                    )}

                    {scopusData ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        {[
                          { label: 'Dokumen', value: scopusData.document_count, color: 'text-blue-500' },
                          { label: 'Sitasi', value: scopusData.total_citations, color: 'text-pink-500' },
                          { label: 'H-Index', value: scopusData.h_index, color: 'text-purple-500' },
                        ].map((s, i) => (
                          <div key={i} className="bg-gray-50/50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700/50">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                            <p className={`text-2xl font-black ${s.color}`}>{s.value || 0}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                       <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 rounded-2xl border border-amber-200/50 text-xs font-bold">
                         <AlertCircle className="w-4 h-4" /> Belum ada data statistik Scopus. Silakan sync data.
                       </div>
                    )}

                    <button
                      onClick={handleSyncScopus}
                      disabled={loading || !scopusId}
                      className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform"
                    >
                      <RefreshCw className={loading ? 'animate-spin' : ''} /> Sync Scopus
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - Status & Cards */}
        <div className="space-y-6">
          {/* Dashboard Highlight Card */}
          <div className="bg-gray-900 dark:bg-white p-8 rounded-[2rem] text-white dark:text-gray-900 shadow-xl shadow-gray-900/20 dark:shadow-white/10 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 dark:bg-black/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 delay-100" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <div className="w-14 h-14 bg-white/10 dark:bg-black/5 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 dark:border-black/5">
                   <Award className="w-7 h-7 text-primary-400 dark:text-primary-600" />
                </div>
                <div className="px-4 py-1.5 bg-primary-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/30">
                  Performa
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-2">Status Institusi</p>
              <h4 className="text-3xl font-black mb-3">Top 10%</h4>
              <p className="text-xs font-bold opacity-80 leading-relaxed max-w-[200px]">
                Kalkulasi berdasarkan rasio sinkronisasi data Scholar dan KPI poin bulan ini.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800/60 p-8 shadow-sm">
            <h4 className="text-[11px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Settings className="w-4 h-4" /> Tautan Cepat
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Panduan SINTA', icon: BadgeCheck, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                { label: 'Bantuan Sistem', icon: Mail, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
                { label: 'Pengaturan Akun', icon: Settings, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' }
              ].map((link, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 bg-gray-50/80 dark:bg-zinc-800/40 rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-500/10 border border-transparent hover:border-primary-100 dark:hover:border-primary-500/20 transition-all duration-300 group">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${link.bg} rounded-xl flex items-center justify-center ${link.color} transition-transform group-hover:scale-110`}>
                        <link.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-zinc-200 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">{link.label}</span>
                   </div>
                   <ChevronRight className="w-5 h-5 text-gray-300 dark:text-zinc-600 group-hover:text-primary-500 translate-x-0 group-hover:translate-x-1.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}