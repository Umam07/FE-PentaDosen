import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

/**
 * Hook untuk mengambil dan mengelola statistik dokumen dan dosen aktif.
 * Menggunakan data default (fallback) jika API gagal di-fetch.
 */
export function useAuthStats() {
  const [totalDocs, setTotalDocs] = useState<number | string>('...');
  const [totalDosen, setTotalDosen] = useState<number | string>('...');

  useEffect(() => {
    authService.fetchDashboardStats()
      .then((data) => {
        const docCount = 
          (data.total_docs || 0) + 
          (data.total_research || 0) + 
          (data.total_scholar || 0) + 
          (data.total_scopus || 0);
        setTotalDocs(docCount);
        if (data.total_dosen !== undefined) {
          setTotalDosen(data.total_dosen);
        }
      })
      .catch((err) => {
        // Logging tetap sesuai aslinya
        console.error('Error fetching stats:', err);
        setTotalDocs(1248);
        setTotalDosen(150);
      });
  }, []);

  return { totalDocs, totalDosen };
}
