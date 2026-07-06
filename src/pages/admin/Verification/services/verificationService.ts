import { VerificationDocument, VerificationResearch } from '../types/verification.types';

/**
 * Mengambil daftar dokumen pending dari API
 */
export async function fetchPendingDocuments(
  role: string,
  userId: number | string
): Promise<VerificationDocument[]> {
  const res = await fetch(`/api/admin/documents?role=${role}&user_id=${userId}`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data.documents || [];
}

/**
 * Mengambil daftar penelitian pending dari API
 */
export async function fetchPendingResearch(
  role: string,
  userId: number | string
): Promise<VerificationResearch[]> {
  const res = await fetch(`/api/penelitian?role=${role}&user_id=${userId}`);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json();
  return data.penelitian || [];
}

/**
 * Mengirim verifikasi (Approve atau Reject) ke server
 */
export async function verifyItem(
  id: string,
  type: 'research' | 'documents',
  status: 'Approved' | 'Rejected',
  role: string,
  adminId: number | string,
  catatan?: string
): Promise<boolean> {
  const endpoint = type === 'research' 
    ? `/api/penelitian/${id}/verify`
    : `/api/admin/documents/${id}/verify`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, role, admin_id: adminId, catatan }),
  });

  return res.ok;
}
