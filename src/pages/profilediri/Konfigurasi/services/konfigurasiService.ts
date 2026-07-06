// Service layer untuk mengelola integrasi dan sinkronisasi platform eksternal.
// Digunakan sebagai penataan kode bersih jika di masa depan handlers dipindahkan dari Profile.tsx ke komponen ini.

export const syncPublications = async (userId: string, platform: 'scholar' | 'scopus' | 'all'): Promise<void> => {
  const response = await fetch(`/api/users/${userId}/sync?platform=${platform}`, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Gagal melakukan sinkronisasi data ${platform}`);
  }
};

export const deletePlatformId = async (userId: string, platform: 'scholar' | 'scopus'): Promise<void> => {
  const response = await fetch(`/api/users/${userId}/${platform}`, { method: 'DELETE' });
  if (!response.ok) {
    throw new Error(`Gagal menghapus ID ${platform}`);
  }
};
