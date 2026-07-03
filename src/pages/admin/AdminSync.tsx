import React, { useState, useEffect, useRef } from 'react';
import { 
  RefreshCw, CheckCircle, AlertCircle, BookOpen, Search, User, 
  GraduationCap, Globe, Users, ChevronRight, X, ChevronLeft,
  ShieldCheck, ArrowRight, Zap, Database, ExternalLink, Filter,
  CheckCircle2, Play, Pause, Square, Terminal, Copy, Check,
  AlertTriangle, Clock, Activity, Info, Settings, Loader2, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useOutletContext } from 'react-router-dom';
import { DropdownSelect } from '../../components/ui/DropdownSelect';

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

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ==========================================
  // ROBUST SYNC QUEUE STATES & REFS
  // ==========================================
  const [syncState, setSyncState] = useState<'idle' | 'running' | 'paused' | 'cancelled' | 'completed'>('idle');
  const [syncLogs, setSyncLogs] = useState<Array<{ time: string; type: 'info' | 'success' | 'error' | 'warning'; msg: string }>>([]);
  const [syncStats, setSyncStats] = useState({ total: 0, processed: 0, success: 0, failed: 0, skipped: 0 });
  const [currentSyncingId, setCurrentSyncingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Refs to avoid stale state in async loops
  const syncStateRef = useRef(syncState);
  const syncStatsRef = useRef(syncStats);
  const currentIndexRef = useRef(0);
  const queueRef = useRef<any[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Keep refs updated with current state
  useEffect(() => {
    syncStateRef.current = syncState;
  }, [syncState]);

  useEffect(() => {
    syncStatsRef.current = syncStats;
  }, [syncStats]);

  // Handle auto-scrolling terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [syncLogs]);

  // Prevent user from leaving page during active sync
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (syncStateRef.current === 'running' || syncStateRef.current === 'paused') {
        e.preventDefault();
        e.returnValue = 'Sinkronisasi massal sedang berjalan. Jika Anda meninggalkan halaman ini, proses sinkronisasi akan terhenti.';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Helper to add log to console
  const addLog = (msg: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSyncLogs((prev) => [...prev, { time, type, msg }]);
  };

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

  // ==========================================
  // SYNC QUEUE RUNNER ENGINE
  // ==========================================
  const runQueue = async () => {
    if (syncStateRef.current !== 'running') return;

    const queue = queueRef.current;
    const index = currentIndexRef.current;

    // If we reached the end of the queue
    if (index >= queue.length) {
      setSyncState('completed');
      setCurrentSyncingId(null);
      addLog('Sinkronisasi massal selesai sepenuhnya!', 'success');
      
      // Log mass sync action to backend
      try {
        await fetch('/api/admin/activity-logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            action: 'Mass Sync',
            description: `Admin menyelesaikan sinkronisasi massal untuk ${syncStatsRef.current.success} dosen berhasil, ${syncStatsRef.current.failed} gagal.`
          })
        });
      } catch (e) {
        console.error('Failed to log mass sync activity', e);
      }

      // Refresh lecturers list
      try {
        const res = await fetch(`/api/admin/lecturers?role=${user?.role}&user_id=${user?.id}`);
        const data = await res.json();
        setLecturers(data.lecturers);
      } catch (err) {
        console.error(err);
      }
      return;
    }

    const lecturer = queue[index];
    setCurrentSyncingId(lecturer.id);
    addLog(`[${index + 1}/${queue.length}] Memulai sinkronisasi data untuk ${lecturer.name}...`, 'info');

    let scholarSuccess = true;
    let scopusSuccess = true;

    // Helper to perform fetch with retry logic
    const fetchWithRetry = async (url: string, sourceName: string, retriesLeft = 2): Promise<boolean> => {
      try {
        const res = await fetch(url, { method: 'POST' });
        
        if (res.ok) {
          return true;
        }

        // Handle rate limits (429)
        if (res.status === 429) {
          if (retriesLeft > 0) {
            addLog(`Batas request terlampaui (429) untuk ${lecturer.name} (${sourceName}). Menunggu cooldown 15 detik sebelum mencoba kembali (Sisa retry: ${retriesLeft})...`, 'warning');
            await new Promise((resolve) => setTimeout(resolve, 15000));
            
            // Check if state changed during wait
            if (syncStateRef.current !== 'running') return false;
            return await fetchWithRetry(url, sourceName, retriesLeft - 1);
          } else {
            addLog(`Gagal sinkronisasi ${sourceName} untuk ${lecturer.name} setelah beberapa kali percobaan (Rate Limit).`, 'error');
            return false;
          }
        }

        addLog(`Server merespons dengan status ${res.status} untuk ${lecturer.name} (${sourceName}).`, 'error');
        return false;
      } catch (err) {
        if (retriesLeft > 0) {
          addLog(`Gagal koneksi untuk ${lecturer.name} (${sourceName}). Mencoba kembali dalam 5 detik...`, 'warning');
          await new Promise((resolve) => setTimeout(resolve, 5000));
          
          if (syncStateRef.current !== 'running') return false;
          return await fetchWithRetry(url, sourceName, retriesLeft - 1);
        }
        addLog(`Gagal melakukan request ${sourceName} untuk ${lecturer.name}: ${err instanceof Error ? err.message : String(err)}`, 'error');
        return false;
      }
    };

    // 1. Sync Google Scholar
    if (lecturer.scholar_id) {
      addLog(`Sinkronisasi Google Scholar (ID: ${lecturer.scholar_id})...`, 'info');
      scholarSuccess = await fetchWithRetry(`/api/users/${lecturer.id}/sync`, 'Google Scholar');
    }

    // Check if paused or cancelled during the first fetch
    if (syncStateRef.current !== 'running') return;

    // 2. Sync Scopus (with a tiny gap if we just ran Scholar sync)
    if (lecturer.scopus_id) {
      if (lecturer.scholar_id) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (syncStateRef.current !== 'running') return;
      }
      addLog(`Sinkronisasi Scopus (ID: ${lecturer.scopus_id})...`, 'info');
      scopusSuccess = await fetchWithRetry(`/api/users/${lecturer.id}/sync-scopus`, 'Scopus');
    }

    // Update stats based on results
    const isSuccess = scholarSuccess && scopusSuccess;
    setSyncStats((prev) => ({
      ...prev,
      processed: prev.processed + 1,
      success: prev.success + (isSuccess ? 1 : 0),
      failed: prev.failed + (isSuccess ? 0 : 1)
    }));

    if (isSuccess) {
      addLog(`Sukses sinkronisasi data ${lecturer.name}.`, 'success');
    } else {
      addLog(`Selesai dengan kendala untuk ${lecturer.name}.`, 'error');
    }

    // Move index to next
    currentIndexRef.current = index + 1;

    // Add throttling delay before next lecturer to avoid rate limits
    if (currentIndexRef.current < queue.length && syncStateRef.current === 'running') {
      const jitter = Math.random() * 2000 - 1000; // ±1 second random variance (jitter)
      const delay = Math.max(1500, 3000 + jitter); // Avg 3 seconds, min 1.5 seconds
      addLog(`Jeda aman ${Math.round(delay / 100) / 10} detik untuk mencegah rate limiting...`, 'info');
      
      await new Promise((resolve) => setTimeout(resolve, delay));
      
      // Check state again after delay
      if (syncStateRef.current === 'running') {
        runQueue();
      }
    } else {
      runQueue();
    }
  };

  const handleStartMassSync = () => {
    if (syncState === 'paused') {
      setSyncState('running');
      addLog('Melanjutkan sinkronisasi massal...', 'info');
      setTimeout(() => runQueue(), 100);
      return;
    }

    const validLecturers = lecturers.filter((l: any) => l.scholar_id || l.scopus_id);
    const skippedCount = lecturers.length - validLecturers.length;

    if (validLecturers.length === 0) {
      setSyncLogs([]);
      setSyncState('completed');
      addLog('Tidak ada dosen terdaftar dengan Scholar ID atau Scopus ID untuk disinkronisasi.', 'warning');
      return;
    }

    queueRef.current = validLecturers;
    currentIndexRef.current = 0;

    setSyncStats({
      total: validLecturers.length,
      processed: 0,
      success: 0,
      failed: 0,
      skipped: skippedCount
    });
    setSyncLogs([]);
    setSyncState('running');
    setCurrentSyncingId(null);

    addLog(`Memulai antrean sinkronisasi massal untuk ${validLecturers.length} dosen (${skippedCount} dosen dilewati karena tidak memiliki ID).`, 'info');
    
    // Start processing after a small timeout to let the UI update first
    setTimeout(() => {
      runQueue();
    }, 100);
  };

  const handlePauseMassSync = () => {
    setSyncState('paused');
    addLog('Sinkronisasi ditangguhkan (pause). Pekerjaan yang sedang berlangsung akan diselesaikan.', 'warning');
  };

  const handleCancelMassSync = () => {
    setSyncState('cancelled');
    setCurrentSyncingId(null);
    addLog('Sinkronisasi massal dibatalkan oleh administrator.', 'error');
  };

  const handleCloseConsole = () => {
    setSyncState('idle');
    setSyncLogs([]);
    setCurrentSyncingId(null);
  };

  const handleCopyLogs = () => {
    const text = syncLogs.map(l => `[${l.time}] [${l.type.toUpperCase()}] ${l.msg}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ==========================================
  // INDIVIDUAL LECTURER SAVING / SYNC ACTIONS
  // ==========================================
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

  // ==========================================
  // SEARCH & FILTER LOGIC
  // ==========================================
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

  // Calculate percentage progress
  const progressPercent = syncStats.total > 0 
    ? Math.round((syncStats.processed / syncStats.total) * 100) 
    : 0;

  // Calculate estimated time remaining (ETA)
  // Assumes average duration of 4.5 seconds per lecturer (sync scholar + sync scopus + delay)
  const etaSeconds = (syncStats.total - syncStats.processed) * 4.5;
  const formatETA = (sec: number) => {
    if (sec <= 0) return '0 detik';
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return m > 0 ? `${m} menit ${s} detik` : `${s} detik`;
  };

  return (
    <div className="max-w-none space-y-8 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-950 dark:text-zinc-100 uppercase tracking-tight">Sinkronisasi Global</h1>
          <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Otomasi Penarikan Data dari Scholar & Scopus
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {syncState === 'idle' ? (
            <button 
              onClick={handleStartMassSync}
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-2xl shadow-sm border border-primary-500 transition-all active:scale-95 text-[11px] font-black uppercase tracking-[0.15em]"
            >
              <RefreshCw className="h-4 w-4" />
              Jalankan Sinkronisasi Total
            </button>
          ) : (
            <button 
              onClick={() => {
                const el = document.getElementById('sync-console-panel');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 px-6 py-3.5 rounded-2xl transition-all active:scale-95 text-[11px] font-black uppercase tracking-[0.15em] border border-zinc-700"
            >
              <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
              Tampilkan Konsol Aktif ({progressPercent}%)
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 flex items-center justify-between group transition-all hover:border-gray-200 dark:hover:border-zinc-700 hover:shadow-sm">
           <div>
              <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Database Dosen</p>
              <p className="text-3xl font-black text-gray-900 dark:text-zinc-100 mt-1">{lecturers.length}</p>
           </div>
           <div className="p-4 bg-primary-50 dark:bg-primary-950/30 rounded-2xl text-primary-600 dark:text-primary-400 border border-primary-100/50 dark:border-primary-900/20">
              <Users className="h-6 w-6" />
           </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 flex items-center justify-between group transition-all hover:border-gray-200 dark:hover:border-zinc-700 hover:shadow-sm">
           <div>
              <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Scholar Connected</p>
              <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">{lecturers.filter(l => l.scholar_id).length}</p>
           </div>
           <div className="p-4 bg-blue-50 dark:bg-blue-955/30 rounded-2xl text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/20">
              <BookOpen className="h-6 w-6" />
           </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none rounded-3xl border border-gray-100 dark:border-zinc-800 p-6 flex items-center justify-between group transition-all hover:border-gray-200 dark:hover:border-zinc-700 hover:shadow-sm">
           <div>
              <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Scopus Connected</p>
              <p className="text-3xl font-black text-orange-600 dark:text-orange-400 mt-1">{lecturers.filter(l => l.scopus_id).length}</p>
           </div>
           <div className="p-4 bg-orange-50 dark:bg-orange-955/30 rounded-2xl text-orange-600 dark:text-orange-400 border border-orange-100/50 dark:border-orange-900/20">
              <Globe className="h-6 w-6" />
           </div>
        </div>
      </div>

      {/* ==========================================
          LIVE SYNC CONSOLE DASHBOARD
          ========================================== */}
      <AnimatePresence>
        {syncState !== 'idle' && (
          <motion.div 
            id="sync-console-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-zinc-900 shadow-lg rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
          >
            {/* Console Header */}
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-950 rounded-xl">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Konsol Sinkronisasi Massal</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sistem Penjadwalan & Monitor Real-time</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Console State Badge */}
                {syncState === 'running' && (
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    Running
                  </span>
                )}
                {syncState === 'paused' && (
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-900/40 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                    Paused
                  </span>
                )}
                {syncState === 'cancelled' && (
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/40 uppercase tracking-widest">
                    Batal
                  </span>
                )}
                {syncState === 'completed' && (
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30 px-3 py-1.5 rounded-lg border border-primary-100 dark:border-primary-900/40 uppercase tracking-widest">
                    Selesai
                  </span>
                )}
              </div>
            </div>

            {/* Console Dashboard Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-zinc-100 dark:border-zinc-800">
              {/* Stats Panel (4 Columns) */}
              <div className="lg:col-span-4 p-6 bg-zinc-50/20 dark:bg-zinc-900/10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-100 dark:border-zinc-800 gap-6">
                
                {/* Stats Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Progress Keseluruhan</span>
                    <span className="text-sm font-black text-zinc-900 dark:text-zinc-100 font-mono">{progressPercent}%</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/60">
                      <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest block">Diproses</span>
                      <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200 font-mono mt-0.5 block">{syncStats.processed} / {syncStats.total}</span>
                    </div>
                    <div className="bg-emerald-50/30 dark:bg-emerald-950/10 p-3 rounded-xl border border-emerald-100/20 dark:border-emerald-900/10">
                      <span className="text-[8px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest block">Berhasil</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">{syncStats.success}</span>
                    </div>
                    <div className="bg-rose-50/30 dark:bg-rose-950/10 p-3 rounded-xl border border-rose-100/20 dark:border-rose-900/10">
                      <span className="text-[8px] font-black uppercase text-rose-600 dark:text-rose-400 tracking-widest block">Gagal</span>
                      <span className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5 block">{syncStats.failed}</span>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/60">
                      <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest block">Dilewati</span>
                      <span className="text-lg font-bold text-zinc-500 dark:text-zinc-500 font-mono mt-0.5 block">{syncStats.skipped}</span>
                    </div>
                  </div>
                </div>

                {/* Queue Control Buttons */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {syncState === 'running' && (
                      <button 
                        onClick={handlePauseMassSync}
                        className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-xl transition-all font-bold text-xs active:scale-95 shadow-md shadow-amber-500/10"
                      >
                        <Pause className="w-3.5 h-3.5" /> Tangguhkan
                      </button>
                    )}
                    {syncState === 'paused' && (
                      <button 
                        onClick={handleStartMassSync}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl transition-all font-bold text-xs active:scale-95 shadow-md shadow-emerald-600/10"
                      >
                        <Play className="w-3.5 h-3.5" /> Lanjutkan
                      </button>
                    )}
                    {(syncState === 'running' || syncState === 'paused') && (
                      <button 
                        onClick={handleCancelMassSync}
                        className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 dark:text-zinc-300 px-4 py-3 rounded-xl transition-all font-bold text-xs active:scale-95 border border-zinc-200 dark:border-zinc-700"
                      >
                        <Square className="w-3.5 h-3.5" /> Batalkan
                      </button>
                    )}
                    {(syncState === 'completed' || syncState === 'cancelled') && (
                      <button 
                        onClick={handleCloseConsole}
                        className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-805 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 px-4 py-3 rounded-xl transition-all font-bold text-xs active:scale-95"
                      >
                        Tutup Konsol
                      </button>
                    )}
                  </div>

                  {syncState === 'running' && (
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest text-center mt-1">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      Estimasi Sisa Waktu: {formatETA(etaSeconds)}
                    </div>
                  )}
                </div>
              </div>

              {/* Terminal Logs Panel (8 Columns) */}
              <div className="lg:col-span-8 bg-zinc-950 p-6 flex flex-col justify-between gap-4 h-[320px]">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] font-mono">Live Logs</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopyLogs}
                      className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider font-mono"
                      title="Salin Log"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Log Terminal Screen */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 pr-2 space-y-1.5 font-mono text-[11px] leading-relaxed select-text">
                  {syncLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 text-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-zinc-700" />
                      <span>Menunggu instruksi antrean sinkronisasi...</span>
                    </div>
                  ) : (
                    syncLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="text-zinc-600 shrink-0">[{log.time}]</span>
                        <span className={`
                          ${log.type === 'success' ? 'text-emerald-400' : ''}
                          ${log.type === 'error' ? 'text-rose-400 font-bold' : ''}
                          ${log.type === 'warning' ? 'text-amber-400' : ''}
                          ${log.type === 'info' ? 'text-zinc-300' : ''}
                        `}>
                          {log.type === 'success' && '✓ '}
                          {log.type === 'error' && '✗ '}
                          {log.type === 'warning' && '⚠ '}
                          {log.msg}
                        </span>
                      </div>
                    ))
                  )}
                  <div ref={terminalEndRef} />
                </div>
              </div>
            </div>
            
            {/* Warning Footer */}
            {(syncState === 'running' || syncState === 'paused') && (
              <div className="px-6 py-3 bg-rose-50/50 dark:bg-rose-950/10 border-t border-rose-100/20 dark:border-rose-900/10 flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 animate-bounce" />
                <p className="text-[9px] md:text-[10px] font-black text-rose-800 dark:text-rose-400 uppercase tracking-widest">
                  Penting: Jangan tutup atau segarkan halaman ini selama sinkronisasi sedang berlangsung.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          LECTURER INDIVIDUAL MANAGEMENT PANEL
          ========================================== */}
      <AnimatePresence mode="wait">
        {scholarUser && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* Lecturer Management Header */}
            <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.02)] dark:shadow-none rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden relative group">
               <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent dark:from-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
               <div className="p-8 flex flex-col md:flex-row gap-8 md:items-center justify-between relative z-10">
                  <div className="flex flex-col md:flex-row gap-6 md:items-center">
                    <div className="h-20 w-20 rounded-3xl bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary-500/20 transform -rotate-2 group-hover:rotate-0 transition-all duration-500 border-2 border-white dark:border-zinc-800 overflow-hidden">
                      {scholarData?.thumbnail ? (
                        <img src={scholarData.thumbnail} alt={scholarUser.name} className="w-full h-full object-cover" />
                      ) : (
                        scholarUser.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-gray-950 dark:text-zinc-100 uppercase tracking-tight">{scholarUser.name}</h4>
                      <div className="mt-2 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6">
                        <p className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest flex items-center">
                          <GraduationCap className="h-4 w-4 mr-2 text-primary-500" />
                          {scholarUser.program_studi || 'N/A'}
                        </p>
                        <p className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-primary-500" />
                          {scholarUser.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedLecturerId('')}
                    className="px-6 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-red-200 dark:hover:border-red-900/30 rounded-2xl text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 group/close"
                  >
                    <X className="w-4 h-4 group-hover/close:rotate-90 transition-transform" /> Tutup Panel
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* GOOGLE SCHOLAR INTEGRATION CARD */}
              <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-[2rem] border border-blue-100/50 dark:border-blue-955/20 overflow-hidden hover:shadow-md transition-shadow">
                <div className="px-8 py-6 border-b border-blue-50 dark:border-blue-955/30 bg-blue-50/20 dark:bg-blue-955/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center">
                    <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-4 shadow-sm">
                      <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-black text-blue-955 dark:text-zinc-100 uppercase tracking-tight">Id Scholar</h3>
                  </div>
                  {messageScholar && (
                    <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-50 dark:bg-emerald-955/20 px-4 py-2 rounded-xl uppercase tracking-widest border border-emerald-100/20">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-2 shrink-0" />
                      {messageScholar}
                    </motion.span>
                  )}
                </div>
                
                <div className="p-8 space-y-8">
                  {/* ID Editor */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Google Scholar ID</label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-305 dark:text-zinc-600"><Zap className="w-4 h-4" /></div>
                        <input
                          type="text"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gray-50/30 dark:bg-zinc-800/30 text-sm font-bold text-gray-900 dark:text-zinc-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all"
                          placeholder="Contoh: xxxxxxxAAAAJ"
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
                        className="px-6 py-3.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[10px] font-black text-gray-600 dark:text-zinc-300 uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all disabled:opacity-50 shadow-sm"
                      >
                        {checkingInfoScholar ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cek'}
                      </button>
                    </div>
                    
                    {/* Verification Result */}
                    {checkedAuthorScholar && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-4 p-5 bg-gradient-to-br from-blue-50/20 to-white dark:from-blue-955/10 dark:to-zinc-900/50 rounded-2xl border border-blue-100/30 dark:border-blue-900/20 flex items-center gap-5 shadow-sm">
                        {checkedAuthorScholar.thumbnail ? (
                          <img src={checkedAuthorScholar.thumbnail} className="h-16 w-16 rounded-2xl object-cover shadow-md border-2 border-white dark:border-zinc-800" />
                        ) : (
                          <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-955/20 flex items-center justify-center"><User className="w-6 h-6 text-blue-400" /></div>
                        )}
                        <div className="flex-1">
                            <h4 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{checkedAuthorScholar.name}</h4>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mt-1 leading-relaxed">{checkedAuthorScholar.affiliations}</p>
                            <button onClick={handleSaveScholarId} className="mt-3 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.15em] hover:text-blue-700 dark:hover:text-blue-300 underline flex items-center gap-1.5">
                              Konfirmasi & Simpan <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Performance Metrics */}
                  <div className="border-t border-gray-100 dark:border-zinc-800 pt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-[11px] font-black text-gray-950 dark:text-zinc-100 uppercase tracking-[0.2em]">Metrik Performa</h4>
                      <button
                        onClick={handleSyncScholar}
                        disabled={loadingScholar || !scholarUser.scholar_id}
                        className="flex items-center gap-2.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingScholar ? 'animate-spin' : ''}`} />
                        Sync Now
                      </button>
                    </div>

                    {scholarData ? (
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'Citations', val: scholarData.total_citations, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50/30 dark:bg-blue-955/10' },
                          { label: 'H-Index', val: scholarData.h_index, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/30 dark:bg-emerald-955/10' },
                          { label: 'i10-Index', val: scholarData.i10_index, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50/30 dark:bg-purple-955/10' },
                        ].map((s, i) => (
                          <div key={i} className={`${s.bg} p-4 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/50 text-center shadow-sm`}>
                            <p className="text-[8px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">{s.label}</p>
                            <p className={`text-2xl font-black ${s.color} font-mono tracking-tight`}>{s.val}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center bg-gray-50/30 dark:bg-zinc-800/20 rounded-2xl border-2 border-dashed border-gray-100 dark:border-zinc-800">
                        <Database className="mx-auto h-8 w-8 text-gray-350 dark:text-zinc-700 mb-3" />
                        <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Snapshot Data Tidak Tersedia</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SCOPUS INTEGRATION CARD */}
              <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-[2rem] border border-orange-100/50 dark:border-orange-955/20 overflow-hidden hover:shadow-md transition-shadow">
                <div className="px-8 py-6 border-b border-orange-50 dark:border-orange-955/30 bg-orange-50/20 dark:bg-orange-955/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center">
                    <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-xl mr-4 shadow-sm">
                      <Globe className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-lg font-black text-orange-955 dark:text-zinc-100 uppercase tracking-tight">Id Scopus</h3>
                  </div>
                  {messageScopus && (
                    <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center bg-emerald-50 dark:bg-emerald-955/20 px-4 py-2 rounded-xl uppercase tracking-widest border border-emerald-100/20">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-2 shrink-0" />
                      {messageScopus}
                    </motion.span>
                  )}
                </div>
                
                <div className="p-8 space-y-8">
                  {/* ID Editor */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Scopus Author ID</label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-305 dark:text-zinc-600"><Zap className="w-4 h-4" /></div>
                        <input
                          type="text"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-gray-50/30 dark:bg-zinc-800/30 text-sm font-bold text-gray-900 dark:text-zinc-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/20 outline-none transition-all"
                          placeholder="Contoh: 57xxxxxxxxx"
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
                        className="px-6 py-3.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl text-[10px] font-black text-gray-600 dark:text-zinc-300 uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all disabled:opacity-50 shadow-sm"
                      >
                        {checkingInfoScopus ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cek'}
                      </button>
                    </div>
                    
                    {/* Verification Result */}
                    {checkedAuthorScopus && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-4 p-5 bg-gradient-to-br from-orange-50/20 to-white dark:from-orange-955/10 dark:to-zinc-900/50 rounded-2xl border border-orange-100/30 dark:border-orange-900/20 flex flex-col gap-2 shadow-sm">
                        <h4 className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">{checkedAuthorScopus.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase leading-relaxed">{checkedAuthorScopus.affiliations}</p>
                        <button onClick={handleSaveScopusId} className="mt-2 text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.15em] hover:text-orange-700 dark:hover:text-orange-300 underline flex items-center gap-1.5 w-fit">
                          Verifikasi & Link ID <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    )}
                  </div>

                  {/* Statistics Panel */}
                  <div className="border-t border-gray-100 dark:border-zinc-800 pt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-[11px] font-black text-gray-950 dark:text-zinc-100 uppercase tracking-[0.2em]">Statistik Output</h4>
                      <button
                        onClick={handleSyncScopus}
                        disabled={loadingScopus || !scholarUser.scopus_id}
                        className="flex items-center gap-2.5 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all active:scale-95 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingScopus ? 'animate-spin' : ''}`} />
                        Sync Now
                      </button>
                    </div>

                    {scopusData ? (
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: 'Documents', val: scopusData.document_count, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50/30 dark:bg-orange-955/10' },
                          { label: 'Citations', val: scopusData.total_citations, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50/30 dark:bg-sky-955/10' },
                          { label: 'H-Index', val: scopusData.h_index, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50/30 dark:bg-teal-955/10' },
                        ].map((s, i) => (
                          <div key={i} className={`${s.bg} p-4 rounded-2xl border border-zinc-100/50 dark:border-zinc-800/50 text-center shadow-sm`}>
                            <p className="text-[8px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">{s.label}</p>
                            <p className={`text-2xl font-black ${s.color} font-mono tracking-tight`}>{s.val}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center bg-gray-50/30 dark:bg-zinc-800/20 rounded-2xl border-2 border-dashed border-gray-100 dark:border-zinc-800">
                        <Database className="mx-auto h-8 w-8 text-gray-355 dark:text-zinc-700 mb-3" />
                        <p className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Data Scopus Belum Terpetakan</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          GLOBAL INTEGRATION TRACKER (TABLE)
          ========================================== */}
      <div className="bg-white dark:bg-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.03)] rounded-[2.5rem] border border-gray-100 dark:border-zinc-800 overflow-hidden">
        
        {/* Table Header Filter controls */}
        <div className="p-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/5 backdrop-blur-sm">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full xl:w-auto">
              <div className="hidden md:flex p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400 shadow-sm border border-primary-100/50 dark:border-primary-900/30">
                 <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-955 dark:text-zinc-100 uppercase tracking-tight">Tracker Kesiapan Data</h3>
                <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">Status integrasi sistem eksternal per individu</p>
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
                <DropdownSelect
                  value={selectedFakultas}
                  onChange={setSelectedFakultas}
                  options={[
                    { value: "", label: "Semua Fakultas" },
                    { value: "Fakultas Kedokteran", label: "Kedokteran" },
                    { value: "Fakultas Kedokteran Gigi", label: "Kedokteran Gigi" },
                    { value: "Fakultas Teknologi Informasi", label: "Teknologi Informasi" },
                    { value: "Fakultas Ekonomi dan Bisnis", label: "Ekonomi dan Bisnis" },
                    { value: "Fakultas Hukum", label: "Hukum" },
                    { value: "Fakultas Psikologi", label: "Psikologi" },
                  ]}
                  icon={<GraduationCap className="w-4 h-4" />}
                  className="w-full sm:w-[220px]"
                />
              )}
            </div>
          </div>
        </div>

        {/* Table Rendering */}
        <div className="overflow-x-auto scrollbar-hide">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-zinc-800">
            <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
              <tr>
                {['Nama Dosen', 'Fakultas / Prodi', 'Scholar Status', 'Scopus Status', 'Kendali'].map((h, i) => (
                  <th 
                    key={i} 
                    className={`px-6 py-5 text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.2em] ${
                      ['Scholar Status', 'Scopus Status', 'Kendali'].includes(h) ? 'text-center' : 'text-left'
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
              {currentLecturers.map((l) => {
                const isCurrentlySyncing = currentSyncingId === l.id;
                
                return (
                  <tr 
                    key={l.id} 
                    className={`group transition-all duration-200 
                      ${selectedLecturerId === l.id ? 'bg-primary-50/20 dark:bg-primary-900/10' : 'hover:bg-primary-50/[0.03] dark:hover:bg-primary-900/10'}
                      ${isCurrentlySyncing ? 'bg-emerald-50/10 dark:bg-emerald-950/5 border-l-4 border-l-emerald-500' : ''}
                    `}
                  >
                    <td className="px-6 py-6 text-left">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-zinc-500 font-black text-lg border border-gray-200 dark:border-zinc-700 shadow-inner group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                          {l.thumbnail ? (
                            <img src={l.thumbnail} alt={l.name} className="w-full h-full object-cover" />
                          ) : (
                            l.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight group-hover:text-primary-600 transition-colors">
                              {l.name}
                            </p>
                            {isCurrentlySyncing && (
                              <span className="flex items-center text-[8px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md uppercase tracking-widest animate-pulse border border-emerald-100/20 shrink-0">
                                <Loader2 className="w-2.5 h-2.5 animate-spin mr-1 text-emerald-500" />
                                Syncing
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 tracking-wider flex items-center gap-1.5 mt-1 uppercase tracking-widest">
                             <Mail className="w-3.5 h-3.5 text-primary-400/70" />
                             {l.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-6 text-left">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">
                          {l.program_studi || 'N/A'}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mt-1.5">
                          {l.fakultas || 'N/A'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-6 text-center">
                      {l.scholar_id ? (
                        <div className="space-y-1.5">
                          <span className="inline-flex items-center gap-2 text-[9px] font-black text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3.5 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/40 uppercase tracking-wider shadow-sm">
                             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                             Scholar Connected
                          </span>
                          <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 font-mono tracking-tight ml-1.5">
                            ID: {l.scholar_id}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-800/30 px-3 py-1.5 rounded-lg border border-gray-100/50 dark:border-zinc-800/50 uppercase tracking-widest opacity-60">
                           Belum Terhubung
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-6 text-center">
                      {l.scopus_id ? (
                        <div className="space-y-1.5">
                          <span className="inline-flex items-center gap-2 text-[9px] font-black text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-3.5 py-1.5 rounded-xl border border-orange-100 dark:border-orange-900/40 uppercase tracking-wider shadow-sm">
                             <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                             Scopus Connected
                          </span>
                          <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 font-mono tracking-tight ml-1.5">
                            ID: {l.scopus_id}
                          </p>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-gray-400 dark:text-zinc-500 bg-gray-50 dark:bg-zinc-800/30 px-3 py-1.5 rounded-lg border border-gray-100/50 dark:border-zinc-800/50 uppercase tracking-widest opacity-60">
                           Belum Terhubung
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-6 text-center">
                       <button
                         onClick={() => {
                           setSelectedLecturerId(l.id);
                           window.scrollTo({ top: 0, behavior: 'smooth' });
                         }}
                         className="px-6 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:border-primary-300 hover:text-primary-600 dark:hover:border-primary-800 rounded-2xl text-[10px] font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest active:scale-95 transition-all shadow-sm inline-flex items-center gap-2.5 group/btn"
                       >
                         Kelola <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Global Pagination */}
        {filteredLecturers.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-8 py-8 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/5 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">
                Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredLecturers.length)} of {filteredLecturers.length}
              </span>
              <div className="h-5 w-px bg-gray-200 dark:bg-zinc-800 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-gray-300 dark:text-zinc-600 tracking-widest">Limit:</span>
                <DropdownSelect
                  value={itemsPerPage}
                  onChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                  options={[
                    { value: 10, label: "10" },
                    { value: 25, label: "25" },
                    { value: 50, label: "50" },
                    { value: 100, label: "100" }
                  ]}
                  size="sm"
                  className="w-[85px]"
                />
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
                        <span className="px-2 text-gray-300 font-bold">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`min-w-[44px] h-11 flex items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          currentPage === p 
                            ? 'bg-primary-600 text-white shadow-sm' 
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
