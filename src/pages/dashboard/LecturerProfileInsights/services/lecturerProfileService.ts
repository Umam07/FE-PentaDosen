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
  const [profile, docsRes] = await Promise.all([
    fetchLecturerProfile(id),
    fetchLecturerDocuments(id)
  ]);
  return {
    profile,
    documents: docsRes.documents || []
  };
};
