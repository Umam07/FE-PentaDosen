import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  User, GraduationCap, Settings,
  Fingerprint, ShieldCheck, Award, Globe, FileText,
  AlertCircle, ArrowRight, CheckCircle, XCircle
} from 'lucide-react';

// Import sub-components
import DetailInformasi from './DetailInformasi';
import Konfigurasi from './Konfigurasi';
import { calculateScholarPoints } from '../dosen/dashboard/pointsCalculator';

export default function Profile({ user, setUser }: { user: any; setUser: any }) {
  const location = useLocation();
  const [scholarId, setScholarId] = useState(user?.scholar_id || '');
  const [scopusId, setScopusId] = useState(user?.scopus_id || '');
  const [scholarData, setScholarData] = useState<any>(null);
  const [scopusData, setScopusData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkingInfo, setCheckingInfo] = useState(false);
  const [checkingScopus, setCheckingScopus] = useState(false);
  const [checkedAuthor, setCheckedAuthor] = useState<any>(null);
  const [checkedScopusAuthor, setCheckedScopusAuthor] = useState<any>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const [showWarningModal, setShowWarningModal] = useState(false);
  // Flag untuk melacak apakah user sudah dismiss modal dalam kunjungan ini.
  // useRef tidak trigger re-render dan akan reset saat komponen di-unmount
  // (yaitu saat user navigasi keluar dari halaman Profile).
  const warningDismissedRef = useRef(false);
  const userLoadedRef = useRef(false);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  const [activeTab, setActiveTab] = useState<'info' | 'integrasi'>(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'integrasi' || params.get('warning') === 'true') {
      return 'integrasi';
    }
    if (tabParam === 'info') {
      return 'info';
    }
    if (user && user.role === 'dosen' && (!user.scholar_id || !user.scopus_id)) {
      return 'integrasi';
    }
    return 'info';
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    
    // 1. Handle tab switching from URL params
    if (tabParam === 'integrasi' || params.get('warning') === 'true') {
      setActiveTab('integrasi');
    } else if (tabParam === 'info') {
      setActiveTab('info');
    } 
    // 2. Handle initial load of user details
    else if (user && !userLoadedRef.current) {
      userLoadedRef.current = true;
      if (user.role === 'dosen' && (!user.scholar_id || !user.scopus_id)) {
        setActiveTab('integrasi');
      }
    }

    // 3. Handle Warning Modal trigger
    if (user && user.role === 'dosen' && (!user.scholar_id || !user.scopus_id) && !warningDismissedRef.current) {
      setShowWarningModal(true);
    }
  }, [user, location.search]);
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

  const stats = useMemo(() => {
    if (!user) return null;

    // Poin eksternal (Scopus + Scholar + Cross, tanpa double-count) - Pure API Data
    const normalizeT = (t: string) => (t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const crossTitles = new Set(
      (publications || []).filter(sd => (scopusPublications || []).some(s => normalizeT(s.title) === normalizeT(sd.title)))
        .map(d => normalizeT(d.title))
    );

    const calculateScopusSintaPoints = (pub: any) => {
      if (pub.awarded_points !== undefined && pub.awarded_points !== null) {
        return Number(pub.awarded_points);
      }

      const role = pub.author_role === 'Member Author' || pub.author_role === 'Co-Author' ? 'Member Author' : (pub.author_role || 'Member Author');
      const totalAuthors = Number(pub.total_authors) || 1;
      const isHyper = !!pub.is_hyperauthor || totalAuthors > 16;
      const q = pub.quartile || 'Q4';
      
      const isArticle = !pub.subtype || pub.subtype.toLowerCase() === 'ar' || pub.subtype.toLowerCase() === 'article';
      
      let basePoints = 0;
      if (isArticle) {
        if (role === 'Single Author') {
          basePoints = 40;
        } else if (isHyper) {
          basePoints = role === 'First Author' ? 24 : 1;
        } else {
          const quartile = ['Q1', 'Q2', 'Q3', 'Q4'].includes(q) ? q : 'Q4';
          if (role === 'First Author') {
            if (quartile === 'Q1') basePoints = 24;
            else if (quartile === 'Q2') basePoints = 22;
            else if (quartile === 'Q3') basePoints = 20;
            else basePoints = 18;
          } else {
            if (quartile === 'Q1') basePoints = 16;
            else if (quartile === 'Q2') basePoints = 14;
            else if (quartile === 'Q3') basePoints = 12;
            else basePoints = 10;
          }
        }
      } else {
        if (role === 'Single Author') basePoints = 30;
        else if (role === 'First Author') basePoints = 18;
        else basePoints = 12;
      }
      
      const citations = Number(pub.citations) || 0;
      const citationPoints = totalAuthors > 0 ? (citations / totalAuthors) : 0;
      const citationBonus = citations > 0 ? 5 : 0;
      
      return basePoints + citationPoints + citationBonus;
    };

    const extCross    = (scopusPublications || []).filter(s => crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);
    const extScopus   = (scopusPublications || []).filter(s => !crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);
    const extScholar  = parseFloat(
      (publications || []).filter(s => !crossTitles.has(normalizeT(s.title))).reduce((a: number, d: any) => a + calculateScholarPoints(d), 0).toFixed(1)
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
  }, [publications]);

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
  }, [scopusPublications]);

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

  const handleDeleteScholarId = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${user.id}/scholar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scholar_id: null,
          avatar: null 
        }),
      });
      if (res.ok) {
        setMessage({ text: 'Scholar ID berhasil dihapus.', type: 'success' });
        setScholarId('');
        setScholarData(null);
        setPublications([]);
        setUser({ 
          ...user, 
          scholar_id: null,
          avatar: null
        });
      }
    } catch (err) {
      setMessage({ text: 'Gagal menghapus Scholar ID.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScopusId = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/${user.id}/scopus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scopus_id: null }),
      });
      if (res.ok) {
        setMessage({ text: 'Scopus ID berhasil dihapus.', type: 'success' });
        setScopusId('');
        setScopusData(null);
        setScopusPublications([]);
        setUser({ ...user, scopus_id: null });
      }
    } catch (err) {
      setMessage({ text: 'Gagal menghapus Scopus ID.', type: 'error' });
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
    <div className="mx-auto min-h-screen max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10">
      <AnimatePresence>
        {showWarningModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900 md:p-8"
            >
              <div>
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
                  <AlertCircle className="h-7 w-7" />
                </div>
                
                <h3 className="mb-3 text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  ID Publikasi Diperlukan
                </h3>
                
                <p className="mb-8 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                  Untuk sinkronisasi poin performa Anda secara otomatis, Anda <span className="text-primary-600 dark:text-primary-400">diwajibkan</span> mengisi ID Google Scholar dan Scopus pada tab <span className="text-slate-900 dark:text-white">Konfigurasi ID</span>.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setShowWarningModal(false);
                      setActiveTab('integrasi');
                    }}
                    className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-black text-white shadow-lg shadow-primary-600/20 transition-colors hover:bg-primary-700"
                  >
                    Lengkapi ID Sekarang
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      warningDismissedRef.current = true;
                      setShowWarningModal(false);
                    }}
                    className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-black text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    Nanti Saja
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Sidebar (Profile Summary & Navigation) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4 lg:sticky lg:top-8 lg:col-span-3"
        >
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="h-20 bg-slate-950 dark:bg-slate-800" />
            <div className="relative z-10 px-5 pb-6 text-center -mt-10">
              <div className="relative inline-block">
                <div className="h-20 w-20 rounded-lg bg-white p-1 shadow-lg dark:bg-slate-900">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-full w-full rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-md bg-primary-600 text-2xl font-black text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
              
              <div className="mt-4 space-y-1">
                <h2 className="text-lg font-black leading-tight tracking-tight text-slate-950 dark:text-white">
                  {user?.name || 'User'}
                </h2>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{user?.program_studi || 'Lecturer'}</p>
                
                {user?.penta_id && (
                  <div className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-md border border-primary-200 bg-primary-50 px-3 py-1.5 text-primary-700 dark:border-primary-900/40 dark:bg-primary-950/20 dark:text-primary-300">
                    <Fingerprint className="h-3.5 w-3.5" />
                    <span className="text-xs font-black">{user.penta_id}</span>
                  </div>
                )}
              </div>

            </div>
          </div>

          <nav className="space-y-1 rounded-lg border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {[
              { id: 'info', label: 'Detail Informasi', icon: User, color: 'text-blue-500' },
              ...(user?.role === 'dosen' ? [{ id: 'integrasi', label: 'Konfigurasi ID', icon: Settings, color: 'text-indigo-500' }] : []),
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-4 text-sm font-black transition-all ${
                  activeTab === tab.id 
                    ? 'bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`}
              >
                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? '' : tab.color}`} />
                {tab.label}
              </button>
            ))}
          </nav>

        </motion.div>

        <div className="space-y-6 lg:col-span-9">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
          >
            <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Lecturer Profile
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">
                  {activeTab === 'info' ? 'Profil Akademik' : activeTab === 'integrasi' ? 'Integrasi & Konfigurasi' : 'Penta Insights'}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {activeTab === 'info' ? 'Kelola data pribadi dan informasi akademik Anda.' : 
                   activeTab === 'integrasi' ? 'Sinkronisasi ID publikasi Scopus dan Google Scholar.' : 
                   'Analisis performa publikasi dan metrik penelitian.'}
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:w-auto">
                {stats?.map((stat, i) => (
                  <div key={i} className="flex min-h-[92px] items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/40 xl:min-w-[190px]">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{stat.label}</span>
                      <span className="mt-1 block text-xl font-black leading-none tracking-tight text-slate-950 dark:text-white">{stat.val}</span>
                    </div>
                  </div>
                ))}
              </div>
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
              ) : (
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
                  handleDeleteScholarId={handleDeleteScholarId}
                  handleDeleteScopusId={handleDeleteScopusId}
                  handleSync={handleSync}
                  handleSyncScopus={handleSyncScopus}
                  handleSyncAll={handleSyncAll}
                  tabVariants={tabVariants}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`pointer-events-auto flex items-center gap-3 rounded-lg border px-5 py-4 shadow-xl ${
                message.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/90 backdrop-blur border-emerald-100 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-400'
                  : 'bg-red-50 dark:bg-red-950/90 backdrop-blur border-red-100 dark:border-red-900/50 text-red-800 dark:text-red-400'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
              )}
              <span className="text-xs font-bold">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
