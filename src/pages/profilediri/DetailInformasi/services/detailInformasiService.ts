import { DetailInformasiUser } from '../types/detailInformasi.types';

// Service untuk mengelola pengambilan data detail informasi user.
// Saat ini data bersumber dari komponen induk (Profile.tsx).
// File ini disiapkan jika di masa depan terdapat kebutuhan fetch langsung.
export const fetchDetailInformasi = async (userId: string): Promise<DetailInformasiUser> => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('Gagal mengambil data detail informasi user');
  }
  return response.json();
};
