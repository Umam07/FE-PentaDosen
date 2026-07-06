import { useState } from 'react';

export const useKonfigurasi = (
  handleDeleteScholarId: () => Promise<void>,
  handleDeleteScopusId: () => Promise<void>
) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'scholar' | 'scopus' | null }>({ type: null });

  // Mengeksekusi penghapusan ID platform yang dipilih dan menutup modal
  const confirmDelete = async () => {
    if (showDeleteConfirm.type === 'scholar') {
      await handleDeleteScholarId();
    } else if (showDeleteConfirm.type === 'scopus') {
      await handleDeleteScopusId();
    }
    setShowDeleteConfirm({ type: null });
  };

  return {
    showDeleteConfirm,
    setShowDeleteConfirm,
    confirmDelete,
  };
};
