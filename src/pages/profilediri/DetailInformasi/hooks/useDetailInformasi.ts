import { useMemo } from 'react';
import { DetailInformasiUser } from '../types/detailInformasi.types';

export const useDetailInformasi = (user: DetailInformasiUser | null | undefined) => {
  // Menghitung kelayakan status kelengkapan data profil
  const completionItems = useMemo(() => {
    return [
      { label: 'Profil dasar', done: Boolean(user?.name && user?.email) },
      { label: 'Data institusi', done: Boolean(user?.fakultas && user?.program_studi) },
      { label: 'Identitas publikasi', done: Boolean(user?.scholar_id && user?.scopus_id) },
    ];
  }, [user]);

  // Menghitung persentase kelengkapan profil dosen
  const completionPercent = useMemo(() => {
    const completedCount = completionItems.filter((item) => item.done).length;
    return Math.round((completedCount / completionItems.length) * 100);
  }, [completionItems]);

  return {
    completionItems,
    completionPercent,
  };
};
