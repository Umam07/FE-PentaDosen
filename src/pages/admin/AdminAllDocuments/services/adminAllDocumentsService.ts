import type { AllDocumentItem, AllResearchItem } from '../types/adminAllDocuments.types';

/**
 * Mengambil daftar seluruh dokumen admin (Publikasi, HKI, Buku)
 */
export async function fetchAllAdminDocuments(role: string, userId: number): Promise<AllDocumentItem[]> {
  const res = await fetch(`/api/admin/documents/all?role=${role}&user_id=${userId}`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  return data.documents || [];
}

/**
 * Mengambil daftar seluruh penelitian admin
 */
export async function fetchAllAdminResearch(role: string, userId: number): Promise<AllResearchItem[]> {
  const res = await fetch(`/api/penelitian?role=${role}&user_id=${userId}&all=true`);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  const data = await res.json();
  return data.penelitian || [];
}
