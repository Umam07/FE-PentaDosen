import type { BukuDoc, ApprovedResearch } from '../types/buku.types';
import { BUKU_CATEGORIES } from '../constants';

/**
 * Mengambil daftar dokumen publikasi buku milik dosen
 */
export async function fetchUserBukuDocuments(userId: string | number): Promise<BukuDoc[]> {
  const res = await fetch(`/api/users/${userId}/documents`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  const bukuDocs = (data.documents || []).filter((d: any) =>
    BUKU_CATEGORIES.some((bc) => bc.value.toLowerCase() === (d.category || '').toLowerCase())
  );
  return bukuDocs;
}

/**
 * Mengambil penelitian yang telah disetujui (Approved) untuk opsi linking
 */
export async function fetchApprovedResearch(userId: string | number): Promise<ApprovedResearch[]> {
  const res = await fetch(`/api/users/${userId}/approved-penelitian`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  return data.success ? (data.penelitian || []) : [];
}

/**
 * Mengunggah file PDF bukti ke dokumen buku
 */
export async function uploadBukuPdf(id: number, formData: FormData): Promise<{ ok: boolean; data: any }> {
  const res = await fetch(`/api/documents/${id}/upload-pdf`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData,
  });
  const data = await res.json();
  return { ok: res.ok, data };
}
