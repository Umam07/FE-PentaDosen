import { useState, useEffect, useRef, useCallback } from 'react';
import type { SyncState, SyncLog, SyncStats, Lecturer, SessionUser } from '../types/adminSync.types';
import { toast } from '@/components/ui/toast';
import { fetchWithRetry, logMassSyncActivity, fetchLecturers } from '../services/adminSyncService';
import { calculateProgress, calculateETA } from '../utils/adminSyncUtils';

interface UseMassSyncParams {
  user: SessionUser;
  lecturers: Lecturer[];
  setLecturers: React.Dispatch<React.SetStateAction<Lecturer[]>>;
}

export function useMassSync({ user, lecturers, setLecturers }: UseMassSyncParams) {
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [syncStats, setSyncStats] = useState<SyncStats>({ total: 0, processed: 0, success: 0, failed: 0, skipped: 0 });
  const [currentSyncingId, setCurrentSyncingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Refs untuk menghindari stale state di async loops
  const syncStateRef = useRef(syncState);
  const syncStatsRef = useRef(syncStats);
  const currentIndexRef = useRef(0);
  const queueRef = useRef<Lecturer[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { syncStateRef.current = syncState; }, [syncState]);
  useEffect(() => { syncStatsRef.current = syncStats; }, [syncStats]);

  // Auto-scroll terminal logs ke bawah
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [syncLogs]);

  // Cegah user meninggalkan halaman saat sync aktif
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (syncStateRef.current === 'running' || syncStateRef.current === 'paused') {
        e.preventDefault();
        e.returnValue = 'Sinkronisasi massal sedang berjalan. Jika Anda meninggalkan halaman ini, proses sinkronisasi akan terhenti.';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => { window.removeEventListener('beforeunload', handleBeforeUnload); };
  }, []);

  const addLog = useCallback((msg: string, type: SyncLog['type'] = 'info') => {
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSyncLogs((prev) => [...prev, { time, type, msg }]);
  }, []);

  const isSyncRunning = useCallback(() => syncStateRef.current === 'running', []);

  // Engine utama: proses queue dosen satu per satu
  const runQueue = useCallback(async () => {
    if (syncStateRef.current !== 'running') return;

    const queue = queueRef.current;
    const index = currentIndexRef.current;

    if (index >= queue.length) {
      setSyncState('completed');
      setCurrentSyncingId(null);
      addLog('Sinkronisasi massal selesai sepenuhnya!', 'success');

      try {
        await logMassSyncActivity(user.id, syncStatsRef.current.success, syncStatsRef.current.failed);
      } catch (e) {
        console.error('Failed to log mass sync activity', e);
      }

      // Refresh daftar dosen setelah sync selesai
      try {
        const refreshed = await fetchLecturers(user.role, user.id);
        setLecturers(refreshed);
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

    // Sync Google Scholar
    if (lecturer.scholar_id) {
      addLog(`Sinkronisasi Google Scholar (ID: ${lecturer.scholar_id})...`, 'info');
      scholarSuccess = await fetchWithRetry(
        `/api/users/${lecturer.id}/sync`, 'Google Scholar', lecturer.name, addLog, isSyncRunning
      );
    }

    if (syncStateRef.current !== 'running') return;

    // Sync Scopus (jeda kecil setelah Scholar untuk menghindari burst)
    if (lecturer.scopus_id) {
      if (lecturer.scholar_id) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        if (syncStateRef.current !== 'running') return;
      }
      addLog(`Sinkronisasi Scopus (ID: ${lecturer.scopus_id})...`, 'info');
      scopusSuccess = await fetchWithRetry(
        `/api/users/${lecturer.id}/sync-scopus`, 'Scopus', lecturer.name, addLog, isSyncRunning
      );
    }

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

    currentIndexRef.current = index + 1;

    // Throttling delay dengan jitter untuk mencegah rate limit
    if (currentIndexRef.current < queue.length && syncStateRef.current === 'running') {
      const jitter = Math.random() * 2000 - 1000;
      const delay = Math.max(1500, 3000 + jitter);
      addLog(`Jeda aman ${Math.round(delay / 100) / 10} detik untuk mencegah rate limiting...`, 'info');

      await new Promise((resolve) => setTimeout(resolve, delay));

      if (syncStateRef.current === 'running') {
        runQueue();
      }
    } else {
      runQueue();
    }
  }, [user, addLog, isSyncRunning, setLecturers]);

  const handleStartMassSync = useCallback(() => {
    if (syncState === 'paused') {
      setSyncState('running');
      addLog('Melanjutkan sinkronisasi massal...', 'info');
      setTimeout(() => runQueue(), 100);
      return;
    }

    const validLecturers = lecturers.filter((l) => l.scholar_id || l.scopus_id);
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

    setTimeout(() => { runQueue(); }, 100);
  }, [syncState, lecturers, addLog, runQueue]);

  const handlePauseMassSync = useCallback(() => {
    setSyncState('paused');
    addLog('Sinkronisasi ditangguhkan (pause). Pekerjaan yang sedang berlangsung akan diselesaikan.', 'warning');
  }, [addLog]);

  const handleCancelMassSync = useCallback(() => {
    setSyncState('cancelled');
    setCurrentSyncingId(null);
    addLog('Sinkronisasi massal dibatalkan oleh administrator.', 'error');
  }, [addLog]);

  const handleCloseConsole = useCallback(() => {
    setSyncState('idle');
    setSyncLogs([]);
    setCurrentSyncingId(null);
  }, []);

  const handleCopyLogs = useCallback(() => {
    const text = syncLogs.map(l => `[${l.time}] [${l.type.toUpperCase()}] ${l.msg}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Log sinkronisasi berhasil disalin ke clipboard!', 'Salin Log');
    setTimeout(() => setCopied(false), 2000);
  }, [syncLogs]);

  const progressPercent = calculateProgress(syncStats);
  const etaSeconds = calculateETA(syncStats);

  return {
    syncState,
    syncLogs,
    syncStats,
    currentSyncingId,
    copied,
    terminalEndRef,
    progressPercent,
    etaSeconds,
    handleStartMassSync,
    handlePauseMassSync,
    handleCancelMassSync,
    handleCloseConsole,
    handleCopyLogs,
  };
}
