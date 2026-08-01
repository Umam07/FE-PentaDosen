import type { ResearchItem } from '../types/research.types';

/**
 * Mengambil daftar penelitian hibah milik dosen
 */
export async function fetchUserResearch(userId: string | number): Promise<ResearchItem[]> {
  const res = await fetch(`/api/penelitian?user_id=${userId}`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  return data.data || [];
}

/**
 * Menghapus penelitian hibah tertentu
 */
export async function deleteResearchItem(id: number): Promise<{ ok: boolean; data: any }> {
  const res = await fetch(`/api/penelitian/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

/**
 * Mengunggah file bukti PDF penelitian
 */
export async function uploadResearchPdf(id: number, formData: FormData): Promise<{ ok: boolean; data: any }> {
  const res = await fetch(`/api/penelitian/${id}/upload-pdf`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData,
  });
  const data = await res.json();
  return { ok: res.ok, data };
}
