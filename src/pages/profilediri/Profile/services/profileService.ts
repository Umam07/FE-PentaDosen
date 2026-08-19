export const fetchProfileData = async (userId: string) => {
  const res = await fetch(`/api/users/${userId}`);
  if (!res.ok) throw new Error('Gagal memuat profil user.');
  return res.json();
};

export const fetchInternalDocuments = async (userId: string) => {
  const res = await fetch(`/api/users/${userId}/documents`);
  if (!res.ok) throw new Error('Gagal memuat dokumen internal.');
  return res.json();
};

export const checkScholarId = async (scholarId: string) => {
  const res = await fetch(`/api/scholar/check/${scholarId}`);
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Google Scholar ID tidak ditemukan.');
  }
  return res.json();
};

export const saveScholarId = async (userId: string, scholarId: string | null, avatar: string | null) => {
  const res = await fetch(`/api/users/${userId}/scholar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      scholar_id: scholarId,
      avatar: avatar
    }),
  });
  if (!res.ok) throw new Error('Gagal menyimpan Google Scholar ID.');
  return res;
};

export const checkScopusId = async (scopusId: string) => {
  const res = await fetch(`/api/scopus/check/${scopusId}`);
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Scopus ID tidak ditemukan.');
  }
  return res.json();
};

export const saveScopusId = async (userId: string, scopusId: string | null) => {
  const res = await fetch(`/api/users/${userId}/scopus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scopus_id: scopusId }),
  });
  if (!res.ok) throw new Error('Gagal menyimpan Scopus ID.');
  return res;
};

export const syncScholar = async (userId: string) => {
  const res = await fetch(`/api/users/${userId}/sync`, { method: 'POST' });
  if (!res.ok) throw new Error('Gagal melakukan sinkronisasi data Scholar.');
  return res;
};

export const syncScopus = async (userId: string) => {
  const res = await fetch(`/api/users/${userId}/sync-scopus`, { method: 'POST' });
  if (!res.ok) throw new Error('Gagal melakukan sinkronisasi data Scopus.');
  return res;
};

export const syncSinta = async (userId: string, force: boolean = true) => {
  const res = await fetch(`/api/users/${userId}/sync-sinta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ force }),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || 'Gagal menarik data dari SINTA.');
  }
  return res.json();
};

