import { LecturerProfile, DocumentsResponse } from '../types';

// Mengambil profil dosen dari API
export const fetchLecturerProfile = async (id: string): Promise<LecturerProfile> => {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch lecturer profile');
  }
  return response.json();
};

// Mengambil dokumen internal dosen dari API
export const fetchLecturerDocuments = async (id: string): Promise<DocumentsResponse> => {
  const response = await fetch(`/api/users/${id}/documents`);
  if (!response.ok) {
    throw new Error('Failed to fetch lecturer documents');
  }
  return response.json();
};

// Mengambil data profil dan dokumen secara paralel
export const getLecturerProfileAndDocs = async (
  id: string
): Promise<{ profile: LecturerProfile; documents: any[] }> => {
  const [profile, docsRes, penRes] = await Promise.all([
    fetchLecturerProfile(id),
    fetchLecturerDocuments(id).catch(() => ({ documents: [] })),
    fetch(`/api/penelitian?user_id=${id}`).then(res => res.ok ? res.json() : { penelitian: [] }).catch(() => ({ penelitian: [] }))
  ]);
  const penDocs = (penRes.penelitian || []).map((p: any) => ({
    ...p,
    id_dokumen: 'RESEARCH-' + p.id,
    category: 'Penelitian',
    title: p.judul_penelitian,
    published_at: null,
    tahun_pelaksanaan: p.tahun,
    is_penelitian: true,
  }));
  return {
    profile,
    documents: [...(docsRes.documents || []), ...penDocs]
  };
};
