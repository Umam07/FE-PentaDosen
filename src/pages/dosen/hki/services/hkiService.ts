import type { HkiDoc, WeightCategory, ApprovedResearch } from '../types/hki.types';

/**
 * Mengambil seluruh dokumen milik dosen (termasuk dokumen HKI)
 */
export async function fetchUserHkiDocuments(userId: string | number): Promise<HkiDoc[]> {
  const res = await fetch(`/api/users/${userId}/documents`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  return data.documents || [];
}

/**
 * Mengambil bobot kriteria kualifikasi dari API /api/weights
 */
export async function fetchCategoryWeights(): Promise<WeightCategory[]> {
  const res = await fetch('/api/weights');
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  return data.weights || [];
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
 * Mengunggah file PDF bukti ke dokumen HKI
 */
export async function uploadHkiPdf(id: number, formData: FormData): Promise<{ ok: boolean; data: any }> {
  const res = await fetch(`/api/documents/${id}/upload-pdf`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData,
  });
  const data = await res.json();
  return { ok: res.ok, data };
}
