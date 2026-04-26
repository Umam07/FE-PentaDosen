import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, GraduationCap, Settings, TrendingUp, Building2,
  Fingerprint, ShieldCheck, Zap, Award, BookMarked, Globe, FileText
} from 'lucide-react';

// Import sub-components
import DetailInformasi from './DetailInformasi';
import Konfigurasi from './Konfigurasi';
import PentaInsight from './PentaInsight';

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
  const [activeTab, setActiveTab] = useState<'info' | 'integrasi' | 'insights'>('info');
  const [publicationSubTab, setPublicationSubTab] = useState<'scopus' | 'scholar' | 'cross_indexed'>('scopus');
  const [publications, setPublications] = useState<any[]>([]);
  const [scopusPublications, setScopusPublications] = useState<any[]>([]);
  const [internalDocuments, setInternalDocuments] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      try {
        const [profileRes, docsRes] = await Promise.all([
          fetch(`/api/users/${user.id}`),
          fetch(`/api/users/${user.id}/documents`)
        ]);

        if (profileRes.ok) {
          const data = await profileRes.json();
          setScholarData(data.scholarData);
          setScopusData(data.scopusData);
          setPublications(data.publications || []);
          setScopusPublications(data.scopusPublications || []);
          setScholarId(data.user.scholar_id || '');
          setScopusId(data.user.scopus_id || '');
          setUser(data.user);
        }

        if (docsRes.ok) {
          const docsData = await docsRes.json();
          setInternalDocuments(docsData.documents || []);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfileData();
  }, [user?.id]);

  const currentYear = new Date().getFullYear();
  const threeYearsAgo = currentYear - 2;

  const stats = useMemo(() => {
    if (!user) return null;

    // Poin eksternal (Scopus + Scholar + Cross, tanpa double-count) - Pure API Data
    const normalizeT = (t: string) => (t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const crossTitles = new Set(
      (publications || []).filter(sd => (scopusPublications || []).some(s => normalizeT(s.title) === normalizeT(sd.title)))
        .map(d => normalizeT(d.title))
    );
    const extCross    = (scopusPublications || []).filter(s => crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + 40 + (d.citations || 0), 0);
    const extScopus   = (scopusPublications || []).filter(s => !crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + 40 + (d.citations || 0), 0);
    const extScholar  = parseFloat(
      (publications || []).filter(s => !crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + 0.5 + (d.citations || 0) * 0.1, 0).toFixed(1)
    );
    const extTotal = parseFloat((extCross + extScopus + extScholar).toFixed(1));

    // Poin internal dokumen (hanya yang upload mandiri/internal)
    const internalTotal = (internalDocuments || [])
      .filter((d: any) => d.status === 'Approved' && d.file_url && d.file_url !== '')
      .reduce((acc: number, d: any) => acc + (Number(d.awarded_points) || 0), 0);

    const grandTotal = parseFloat((extTotal + internalTotal).toFixed(1));

    return [
      { 
        label: 'Total Performance', 
        val: grandTotal.toLocaleString(), 
        icon: Award, 
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
      },
      { 
        label: 'Poin API (External)',
        val: extTotal.toLocaleString(),
        icon: Globe, 
        color: 'bg-primary-500/10 text-primary-600 dark:text-primary-400' 
      },
      { 
        label: 'Poin Upload (Internal)',
        val: internalTotal.toLocaleString(),
        icon: FileText, 
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
      }
    ];
  }, [user, publications, scopusPublications, internalDocuments]);

  const scholarChartData = useMemo(() => {
    if (!publications || publications.length === 0) return { chartData: [], leftMax: 10, rightMax: 10 };
    const chartDataMap = new Map();
    publications.forEach((pub: any) => {
       if (pub.year && pub.year !== 'Unknown') {
         const yearKey = String(pub.year).trim();
         if (!chartDataMap.has(yearKey)) {
            chartDataMap.set(yearKey, { name: yearKey, publications: 0, citations: 0 });
         }
         const current = chartDataMap.get(yearKey);
         current.publications += 1;
         current.citations += (Number(pub.citations) || 0);
       }
    });
    const chartData = Array.from(chartDataMap.values()).sort((a: any, b: any) => parseInt(a.name) - parseInt(b.name));
    const getNiceMax = (max: number) => {
      if (!max || max <= 0) return 10;
      const roughMax = max * 1.15; 
      const magnitude = Math.pow(10, Math.floor(Math.log10(roughMax)));
      return Math.ceil(roughMax / magnitude) * magnitude;
    };
    return { 
      chartData, 
      leftMax: getNiceMax(Math.max(...chartData.map(d => d.publications), 0)), 
      rightMax: getNiceMax(Math.max(...chartData.map(d => d.citations), 0)) 
    };
  }, [scholarData]);

  const scopusChartData = useMemo(() => {
    if (!scopusPublications || scopusPublications.length === 0) return { chartData: [], leftMax: 10, rightMax: 10 };
    const chartDataMap = new Map();
    scopusPublications.forEach((pub: any) => {
       if (pub.year && pub.year !== 'Unknown') {
         const yearKey = String(pub.year).trim();
         if (!chartDataMap.has(yearKey)) {
            chartDataMap.set(yearKey, { name: yearKey, publications: 0, citations: 0 });
         }
         const current = chartDataMap.get(yearKey);
         current.publications += 1;
         current.citations += (Number(pub.citations) || 0);
       }
    });
    const chartData = Array.from(chartDataMap.values()).sort((a: any, b: any) => parseInt(a.name) - parseInt(b.name));
    const getNiceMax = (max: number) => {
      if (!max || max <= 0) return 10;
      const roughMax = max * 1.15; 
      const magnitude = Math.pow(10, Math.floor(Math.log10(roughMax)));
      return Math.ceil(roughMax / magnitude) * magnitude;
    };
    return { 
      chartData, 
      leftMax: getNiceMax(Math.max(...chartData.map(d => d.publications), 0)), 
      rightMax: getNiceMax(Math.max(...chartData.map(d => d.citations), 0)) 
    };
  }, [scopusData]);

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
        body: JSON.stringify({ 
          scholar_id: scholarId,
          avatar: checkedAuthor?.thumbnail 
        }),
      });
      if (res.ok) {
        setMessage({ text: 'Scholar ID berhasil disimpan.', type: 'success' });
        setUser({ 
          ...user, 
          scholar_id: scholarId,
          avatar: checkedAuthor?.thumbnail || user.avatar
        });
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
        setPublications(data.publications || []);
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
        setScopusPublications(data.scopusPublications || []);
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

  const handleSyncAll = async () => {
    if (!scholarId && !scopusId) {
      setMessage({ text: 'Simpan setidaknya satu ID (Scholar atau Scopus) terlebih dahulu.', type: 'error' });
      return;
    }
    
    try {
      setLoading(true);
      setMessage({ text: 'Sedang sinkronisasi data...', type: '' });
      
      const syncPromises = [];
      if (scholarId) syncPromises.push(fetch(`/api/users/${user.id}/sync`, { method: 'POST' }));
      if (scopusId) syncPromises.push(fetch(`/api/users/${user.id}/sync-scopus`, { method: 'POST' }));
      
      const results = await Promise.all(syncPromises);
      const allOk = results.every(res => res.ok);
      
      if (allOk) {
        setMessage({ text: 'Semua data berhasil disinkronisasi.', type: 'success' });
        // Refresh data
        const profileRes = await fetch(`/api/users/${user.id}`);
        const data = await profileRes.json();
        setScholarData(data.scholarData);
        setPublications(data.publications || []);
        setScopusData(data.scopusData);
        setScopusPublications(data.scopusPublications || []);
        setUser(data.user);
      } else {
        setMessage({ text: 'Beberapa data gagal disinkronisasi.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Error saat sinkronisasi data.', type: 'error' });
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
    <div className="max-w-[1600px] mx-auto px-4 py-8 sm:px-6 lg:px-10 min-h-screen">
      {/* New Professional Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Sidebar (Profile Summary & Navigation) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 space-y-6 lg:sticky lg:top-8"
        >
          {/* Compact Profile Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden group">
            <div className="h-24 bg-gradient-to-r from-primary-600 to-emerald-600 relative overflow-hidden">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
            </div>
            <div className="px-6 pb-8 -mt-12 relative z-10 text-center">
              <div className="inline-block relative">
                <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-800 p-1 shadow-xl">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover rounded-2xl border-2 border-white dark:border-slate-900"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center text-white text-3xl font-black border-2 border-white dark:border-slate-900">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-slate-900 rounded-lg shadow-lg flex items-center justify-center border border-slate-100 dark:border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
              
              <div className="mt-4 space-y-1">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-tight">
                  {user?.name || 'User'}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user?.program_studi || 'Lecturer'}</p>
                
                {user?.penta_id && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 mt-3 mx-auto">
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black tracking-[0.1em]">{user.penta_id}</span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Vertical Menu */}
          <nav className="bg-white dark:bg-slate-900 p-3 rounded-[2rem] border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-1">
            {[
              { id: 'info', label: 'Detail Informasi', icon: User, color: 'text-blue-500' },
              { id: 'integrasi', label: 'Konfigurasi ID', icon: Settings, color: 'text-indigo-500' },
              { id: 'insights', label: 'Penta Insights', icon: TrendingUp, color: 'text-emerald-500' },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-200 dark:shadow-none translate-x-1' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:translate-x-1'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? '' : tab.color}`} />
                {tab.label}
              </button>
            ))}
          </nav>

        </motion.div>

        {/* RIGHT COLUMN: Content Area */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* Refined Header Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-[0.2em] mb-3">
                <ShieldCheck className="w-3 h-3" />
                Verified Lecturer Profile
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                {activeTab === 'info' ? 'Profil Akademik' : activeTab === 'integrasi' ? 'Integrasi & Konfigurasi' : 'Penta Insights'}
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {activeTab === 'info' ? 'Kelola data pribadi dan informasi akademik Anda' : 
                 activeTab === 'integrasi' ? 'Sinkronisasi ID publikasi Scopus dan Google Scholar' : 
                 'Analisis performa publikasi dan metrik penelitian'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
               {stats?.map((stat, i) => (
                 <div key={i} className="flex items-center gap-4 px-6 py-4 bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                    <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center shadow-inner`}>
                       <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</span>
                       <span className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{stat.val}</span>
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabVariants}
              className="w-full"
            >
              {activeTab === 'info' ? (
                <DetailInformasi user={user} tabVariants={tabVariants} />
              ) : activeTab === 'integrasi' ? (
                <Konfigurasi 
                  user={user}
                  setUser={setUser}
                  scholarId={scholarId}
                  setScholarId={setScholarId}
                  scopusId={scopusId}
                  setScopusId={setScopusId}
                  scholarData={scholarData}
                  setScholarData={setScholarData}
                  scopusData={scopusData}
                  setScopusData={setScopusData}
                  loading={loading}
                  setLoading={setLoading}
                  checkingInfo={checkingInfo}
                  setCheckingInfo={setCheckingInfo}
                  checkingScopus={checkingScopus}
                  setCheckingScopus={setCheckingScopus}
                  checkedAuthor={checkedAuthor}
                  setCheckedAuthor={setCheckedAuthor}
                  checkedScopusAuthor={checkedScopusAuthor}
                  setCheckedScopusAuthor={setCheckedScopusAuthor}
                  message={message}
                  setMessage={setMessage}
                  scholarChartData={scholarChartData}
                  scopusChartData={scopusChartData}
                  handleCheckId={handleCheckId}
                  handleSaveScholarId={handleSaveScholarId}
                  handleCheckScopusId={handleCheckScopusId}
                  handleSaveScopusId={handleSaveScopusId}
                  handleSync={handleSync}
                  handleSyncScopus={handleSyncScopus}
                  handleSyncAll={handleSyncAll}
                  tabVariants={tabVariants}
                />
              ) : (
                <PentaInsight 
                  publicationSubTab={publicationSubTab}
                  setPublicationSubTab={setPublicationSubTab}
                  scopusChartData={scopusChartData}
                  scholarChartData={scholarChartData}
                  scopusData={scopusData}
                  scholarData={scholarData}
                  publications={publications}
                  scopusPublications={scopusPublications}
                  tabVariants={tabVariants}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
