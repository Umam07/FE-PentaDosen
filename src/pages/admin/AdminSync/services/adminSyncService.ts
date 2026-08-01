import type { Lecturer, LecturerProfile, CheckedAuthor } from '../types/adminSync.types';

/**
 * Mengambil daftar seluruh dosen dari API
 */
export async function fetchLecturers(role: string, userId: number): Promise<Lecturer[]> {
  const res = await fetch(`/api/admin/lecturers?role=${role}&user_id=${userId}`);
  const data = await res.json();
  return data.lecturers || [];
}

/**
 * Mengambil profil lengkap dosen beserta data Scholar & Scopus
 */
export async function fetchLecturerProfile(lecturerId: string): Promise<LecturerProfile> {
  const res = await fetch(`/api/users/${lecturerId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/**
 * Mengecek validitas Google Scholar ID sebelum disimpan
 */
export async function checkScholarId(scholarId: string): Promise<CheckedAuthor> {
  const res = await fetch(`/api/scholar/check/${scholarId}`);
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Author tidak ditemukan');
  }
  return res.json();
}

/**
 * Menyimpan Google Scholar ID ke profil dosen
 */
export async function saveScholarId(lecturerId: string, scholarId: string): Promise<boolean> {
  const res = await fetch(`/api/users/${lecturerId}/scholar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scholar_id: scholarId }),
  });
  return res.ok;
}

/**
 * Trigger sinkronisasi data Google Scholar untuk dosen
 */
export async function syncScholar(lecturerId: string): Promise<boolean> {
  const res = await fetch(`/api/users/${lecturerId}/sync`, { method: 'POST' });
  return res.ok;
}

/**
 * Mengecek validitas Scopus Author ID sebelum disimpan
 */
export async function checkScopusId(scopusId: string): Promise<CheckedAuthor> {
  const res = await fetch(`/api/scopus/check/${scopusId}`);
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Author tidak ditemukan');
  }
  return res.json();
}

/**
 * Menyimpan Scopus ID ke profil dosen
 */
export async function saveScopusId(lecturerId: string, scopusId: string): Promise<boolean> {
  const res = await fetch(`/api/users/${lecturerId}/scopus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scopus_id: scopusId }),
  });
  return res.ok;
}

/**
 * Trigger sinkronisasi data Scopus untuk dosen
 */
export async function syncScopus(lecturerId: string): Promise<boolean> {
  const res = await fetch(`/api/users/${lecturerId}/sync-scopus`, { method: 'POST' });
  return res.ok;
}

/**
 * Mencatat aktivitas mass sync ke log backend
 */
export async function logMassSyncActivity(
  userId: number,
  successCount: number,
  failedCount: number
): Promise<void> {
  await fetch('/api/admin/activity-logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      action: 'Mass Sync',
      description: `Admin menyelesaikan sinkronisasi massal untuk ${successCount} dosen berhasil, ${failedCount} gagal.`
    })
  });
}

/**
 * Fetch dengan retry logic untuk mass sync — handle rate limit 429 & network error
 * Header X-Suppress-Rate-Limit-Modal mencegah modal rate limit global muncul
 */
export async function fetchWithRetry(
  url: string,
  sourceName: string,
  lecturerName: string,
  addLog: (msg: string, type: 'info' | 'success' | 'error' | 'warning') => void,
  isSyncRunning: () => boolean,
  retriesLeft = 2
): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'X-Suppress-Rate-Limit-Modal': 'true' }
    });

    if (res.ok) return true;

    if (res.status === 429) {
      if (retriesLeft > 0) {
        addLog(`Batas request terlampaui (429) untuk ${lecturerName} (${sourceName}). Menunggu cooldown 15 detik sebelum mencoba kembali (Sisa retry: ${retriesLeft})...`, 'warning');
        await new Promise((resolve) => setTimeout(resolve, 15000));
        if (!isSyncRunning()) return false;
        return await fetchWithRetry(url, sourceName, lecturerName, addLog, isSyncRunning, retriesLeft - 1);
      } else {
        addLog(`Gagal sinkronisasi ${sourceName} untuk ${lecturerName} setelah beberapa kali percobaan (Rate Limit).`, 'error');
        return false;
      }
    }

    addLog(`Server merespons dengan status ${res.status} untuk ${lecturerName} (${sourceName}).`, 'error');
    return false;
  } catch (err) {
    if (retriesLeft > 0) {
      addLog(`Gagal koneksi untuk ${lecturerName} (${sourceName}). Mencoba kembali dalam 5 detik...`, 'warning');
      await new Promise((resolve) => setTimeout(resolve, 5000));
      if (!isSyncRunning()) return false;
      return await fetchWithRetry(url, sourceName, lecturerName, addLog, isSyncRunning, retriesLeft - 1);
    }
    addLog(`Gagal melakukan request ${sourceName} untuk ${lecturerName}: ${err instanceof Error ? err.message : String(err)}`, 'error');
    return false;
  }
}
