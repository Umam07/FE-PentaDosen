import type { SyncStats } from '../types/adminSync.types';

/**
 * Format estimasi waktu tersisa berdasarkan asumsi ~4.5 detik per dosen
 */
export function formatETA(seconds: number): string {
  if (seconds <= 0) return '0 detik';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m} menit ${s} detik` : `${s} detik`;
}

/**
 * Hitung persentase progress sinkronisasi massal
 */
export function calculateProgress(stats: SyncStats): number {
  return stats.total > 0 ? Math.round((stats.processed / stats.total) * 100) : 0;
}

/**
 * Hitung estimasi waktu tersisa (dalam detik)
 * Asumsi rata-rata 4.5 detik per dosen (sync scholar + scopus + delay)
 */
export function calculateETA(stats: SyncStats): number {
  return (stats.total - stats.processed) * 4.5;
}
