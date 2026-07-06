import { useState, useEffect, useMemo, useCallback } from 'react';
import { ActivityLog, SessionUser } from '../types/activityLogs.types';
import { fetchActivityLogs, fetchExportLogs } from '../services/activityLogsService';
import { exportToExcel } from '../utils/activityLogsUtils';

/**
 * Custom hook untuk mengelola state dan efek terkait halaman Log Aktivitas
 */
export function useActivityLogs(user: SessionUser) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [copiedId, setCopiedId] = useState<number | string | null>(null);
  
  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Mengambil data log dari API
  const getLogsData = useCallback(async (page: number, limit: number, action: string) => {
    try {
      setLoading(true);
      const data = await fetchActivityLogs(page, limit, action);
      setLogs(data.logs);
      setTotalItems(data.total);
      setTotalPages(data.last_page);
    } catch (err) {
      console.error('Gagal memuat logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Efek untuk mengambil data setiap kali halaman, limit, atau filter aksi berubah
  useEffect(() => {
    getLogsData(currentPage, itemsPerPage, selectedAction);
  }, [currentPage, itemsPerPage, selectedAction, getLogsData]);

  // Reset kembali ke halaman 1 ketika pencarian atau filter aksi berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedAction]);

  // Melakukan filter lokal log saat ini berdasarkan searchTerm
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [logs, searchTerm]);

  // Statistik yang dihitung secara lokal dari data log halaman saat ini
  const stats = useMemo(() => {
    const loginCount = logs.filter((l) => l.action.toLowerCase().includes('login')).length;
    const verifyCount = logs.filter((l) => l.action.toLowerCase().includes('verify')).length;
    const syncCount = logs.filter((l) => l.action.toLowerCase().includes('sync')).length;
    
    return { loginCount, verifyCount, syncCount };
  }, [logs]);

  // Fungsi fallback untuk copy to clipboard jika clipboard API tidak tersedia
  const fallbackCopy = useCallback((text: string, id: number | string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; 
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Fallback copy gagal: ', err);
    }
    document.body.removeChild(textArea);
  }, []);

  // Menyalin detail log ke clipboard
  const handleCopy = useCallback((text: string, id: number | string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedId(id);
          setTimeout(() => setCopiedId(null), 2000);
        })
        .catch((err) => {
          console.error('Gagal menyalin teks: ', err);
          fallbackCopy(text, id);
        });
    } else {
      fallbackCopy(text, id);
    }
  }, [fallbackCopy]);

  // Melakukan ekspor log ke file Excel
  const handleExportExcel = useCallback(async () => {
    try {
      setLoading(true);
      const allLogs = await fetchExportLogs(selectedAction);
      await exportToExcel(allLogs, user, selectedAction, searchTerm);
    } catch (err) {
      console.error('Gagal mengekspor excel:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedAction, searchTerm, user]);

  return {
    logs,
    loading,
    searchTerm,
    setSearchTerm,
    selectedAction,
    setSelectedAction,
    copiedId,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalItems,
    totalPages,
    filteredLogs,
    loginCount: stats.loginCount,
    verifyCount: stats.verifyCount,
    syncCount: stats.syncCount,
    handleCopy,
    handleExportExcel
  };
}
