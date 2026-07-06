import { LecturerProfileData } from '../types/lecturerProfile.types';

/**
 * Mengambil profil dosen dari server
 */
export async function fetchProfileData(id: string): Promise<LecturerProfileData> {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) {
    throw new Error(`Gagal mengambil data user: ${res.status}`);
  }
  return await res.json();
}

/**
 * Mengambil dokumen akademik internal milik dosen
 */
export async function fetchInternalDocuments(id: string): Promise<any[]> {
  const res = await fetch(`/api/users/${id}/documents`);
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return data.documents || [];
}

/**
 * Mengambil penelitian milik dosen dan memformatnya seperti bentuk dokumen internal
 */
export async function fetchResearchDocuments(id: string): Promise<any[]> {
  const res = await fetch(`/api/penelitian?user_id=${id}`);
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  return (data.penelitian || []).map((p: any) => ({
    ...p,
    id_dokumen: 'RESEARCH-' + p.id,
    category: 'Penelitian',
    title: p.judul_penelitian,
    published_at: null,
    tahun_pelaksanaan: p.tahun,
    is_penelitian: true,
  }));
}

/**
 * Menggabungkan seluruh data profile, dokumen internal, dan penelitian secara paralel
 */
export async function fetchProfileAndDocuments(
  id: string
): Promise<{ profile: LecturerProfileData | null; internalDocs: any[] }> {
  const [profile, docs, research] = await Promise.all([
    fetchProfileData(id).catch(err => {
      console.error(err);
      return null;
    }),
    fetchInternalDocuments(id).catch(err => {
      console.error(err);
      return [];
    }),
    fetchResearchDocuments(id).catch(err => {
      console.error(err);
      return [];
    })
  ]);

  return {
    profile,
    internalDocs: [...docs, ...research]
  };
}
