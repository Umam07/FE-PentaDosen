import type { LecturerUser, CategoryWeight } from '../types/adminInputDocument.types';

/**
 * Mengambil daftar dosen untuk selector dropdown
 */
export async function fetchAdminLecturers(role: string, userId: number): Promise<LecturerUser[]> {
  const res = await fetch(`/api/admin/lecturers?role=${role}&user_id=${userId}`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  return data.lecturers || [];
}

/**
 * Mengambil bobot poin per kategori dari API /api/weights
 */
export async function fetchCategoryWeights(): Promise<CategoryWeight[]> {
  const res = await fetch('/api/weights');
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  return data.weights || [];
}

/**
 * Mengunggah dokumen/penelitian manual
 */
export async function submitDocument(endpoint: string, formData: FormData): Promise<{ ok: boolean; data: any }> {
  const res = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return { ok: res.ok, data };
}

/**
 * Mengunggah 1 baris dokumen dari import Excel
 */
export async function importBatchRow(endpoint: string, formData: FormData): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData,
  });
  let data: any = {};
  try {
    data = await res.json();
  } catch (e) {
    // Abaikan jika respons bukan JSON
  }
  return { ok: res.ok, status: res.status, data };
}
