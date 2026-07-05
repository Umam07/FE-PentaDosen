/**
 * Service untuk operasi dokumen internal yang membutuhkan komunikasi ke server.
 * Saat ini mencakup operasi file — endpoint lain ditambahkan di sini kalau ada.
 */
export const internalDocumentsService = {
  /**
   * Mengambil URL file dokumen internal.
   * Mengembalikan null kalau file tidak tersedia atau terjadi error.
   */
  getFileUrl: async (docId: number): Promise<string | null> => {
    try {
      const res = await fetch(`/api/internal-documents/${docId}/file`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.file_url ?? null;
    } catch (err) {
      console.error('Gagal mengambil URL file dokumen internal:', err);
      return null;
    }
  },
};
