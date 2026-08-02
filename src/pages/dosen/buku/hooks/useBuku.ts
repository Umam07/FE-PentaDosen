import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import type { BukuDoc, ApprovedResearch, UserSession, PreviewDocState, StatsInfo } from '../types/buku.types';
import { fetchUserBukuDocuments, fetchApprovedResearch, uploadBukuPdf } from '../services/bukuService';
import { generateBukuExcelTemplate } from '../utils/bukuUtils';

export function useBuku(user: UserSession) {
  const location = useLocation();
  const urlKategori = useMemo(() => {
    return new URLSearchParams(location.search).get('kategori') || '';
  }, [location.search]);

  const [documents, setDocuments] = useState<BukuDoc[]>([]);
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<BukuDoc | null>(null);

  const activeDetailDoc = useMemo(() => {
    if (!selectedDocForDetail) return null;
    return documents.find((d) => d.id === selectedDocForDetail.id) || selectedDocForDetail;
  }, [documents, selectedDocForDetail]);

  const [isTableLoading, setIsTableLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterKategori, setFilterKategori] = useState('');

  useEffect(() => {
    if (urlKategori) {
      setFilterKategori(urlKategori);
    }
  }, [urlKategori]);

  const [isImporting, setIsImporting] = useState(false);
  const [uploadingPdfId, setUploadingPdfId] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [previewDoc, setPreviewDoc] = useState<PreviewDocState | null>(null);

  const [approvedResearch, setApprovedResearch] = useState<ApprovedResearch[]>([]);
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
  const [docToLink, setDocToLink] = useState<BukuDoc | null>(null);

  const [editDoc, setEditDoc] = useState<BukuDoc | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [deleteDoc, setDeleteDoc] = useState<BukuDoc | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const [filterYear, setFilterYear] = useState<number | null>(currentYear);

  const showMessage = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4500);
  }, []);

  const loadDocuments = useCallback(async () => {
    if (!user?.id) return;
    try {
      const docs = await fetchUserBukuDocuments(user.id);
      setDocuments(docs);
    } catch (err) {
      console.error('Error fetching buku documents:', err);
    }
  }, [user?.id]);

  const loadApprovedResearch = useCallback(async () => {
    if (!user?.id) return;
    try {
      const research = await fetchApprovedResearch(user.id);
      setApprovedResearch(research);
    } catch (err) {
      console.error('Error fetching approved research:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    const initData = async () => {
      setIsTableLoading(true);
      await Promise.all([loadDocuments(), loadApprovedResearch()]);
      setIsTableLoading(false);
    };
    initData();
  }, [loadDocuments, loadApprovedResearch]);

  const filteredDocuments = useMemo(() => {
    let result = documents;
    if (filterKategori) {
      result = result.filter((d) => d.category === filterKategori);
    }
    if (filterYear) {
      result = result.filter((d) => {
        const y = d.published_at ? new Date(d.published_at).getFullYear() : null;
        return y === filterYear;
      });
    }
    return result;
  }, [documents, filterKategori, filterYear]);

  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    (documents || []).forEach((d) => {
      if (d.published_at) {
        const y = new Date(d.published_at).getFullYear();
        if (!isNaN(y) && y > 1900 && y <= 2100) {
          yearsSet.add(y);
        }
      }
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [documents]);

  const stats: StatsInfo = useMemo(() => {
    const cutoffYear = currentYear - 2;
    const valid = filteredDocuments.filter((d) => {
      const y = d.published_at ? new Date(d.published_at).getFullYear() : 0;
      return d.status === 'Approved' && y >= cutoffYear;
    });
    return {
      total: filteredDocuments.length,
      approved: filteredDocuments.filter((d) => d.status === 'Approved').length,
      pending: filteredDocuments.filter((d) => d.status === 'Pending' || d.status === 'Verified by Fakultas').length,
      points: Math.round(valid.reduce((acc, d) => acc + (Number(d.awarded_points) || 0), 0)),
      validCount: valid.length,
    };
  }, [filteredDocuments, currentYear]);

  const handleUploadPdf = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      showMessage('Hanya file PDF atau gambar yang diperbolehkan.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showMessage('Ukuran file maksimal 10MB.', 'error');
      return;
    }

    setUploadingPdfId(id);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadBukuPdf(id, formData);
      if (res.ok) {
        showMessage('Dokumen berhasil diunggah!', 'success');
        setIsTableLoading(true);
        await loadDocuments();
        setIsTableLoading(false);
      } else {
        showMessage(res.data?.message || 'Gagal mengunggah dokumen.', 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Terjadi kesalahan saat mengunggah.', 'error');
    } finally {
      setUploadingPdfId(null);
      if (e.target) e.target.value = '';
    }
  }, [showMessage, loadDocuments]);

  const handleDownloadTemplate = useCallback(async () => {
    await generateBukuExcelTemplate();
  }, []);

  const handleImportExcel = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    showMessage('Membaca file Excel...', 'success');
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          showMessage('File excel kosong.', 'error');
          setIsImporting(false);
          return;
        }

        showMessage(`Mengimpor ${data.length} data...`, 'success');
        let successCount = 0;
        let failCount = 0;
        let lastErrorMessage = '';

        for (let i = 0; i < data.length; i++) {
          const row: any = data[i];
          const formData = new FormData();
          formData.append('user_id', String(user.id));
          formData.append('title', row['Judul Buku'] || '');
          formData.append('category', row['Kategori'] || 'Buku Referensi');
          formData.append('published_at', `${row['Tahun Terbit'] || new Date().getFullYear()}-01-01`);
          formData.append('doc_type', (row['Tipe Dokumen'] || 'kpi').toLowerCase());

          const res = await fetch('/api/documents', {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: formData,
          });

          if (res.ok) {
            successCount++;
          } else {
            failCount++;
            const errRes = await res.json().catch(() => ({}));
            lastErrorMessage = errRes.message || 'Gagal menyimpan row.';
          }
        }

        if (successCount > 0) {
          showMessage(`Berhasil mengimpor ${successCount} buku.${failCount > 0 ? ` (${failCount} gagal)` : ''}`, 'success');
          setIsTableLoading(true);
          await loadDocuments();
          setIsTableLoading(false);
        } else {
          showMessage(`Gagal mengimpor file: ${lastErrorMessage}`, 'error');
        }
      } catch (err) {
        console.error(err);
        showMessage('Terjadi kesalahan saat memproses file Excel.', 'error');
      } finally {
        setIsImporting(false);
        if (e.target) e.target.value = '';
      }
    };
    reader.readAsBinaryString(file);
  }, [user?.id, showMessage, loadDocuments]);

  return {
    urlKategori,
    documents,
    selectedDocForDetail,
    setSelectedDocForDetail,
    activeDetailDoc,
    isTableLoading,
    setIsTableLoading,
    message,
    messageType,
    showMessage,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    filterKategori,
    setFilterKategori,
    isImporting,
    uploadingPdfId,
    isUploadModalOpen,
    setIsUploadModalOpen,
    previewDoc,
    setPreviewDoc,
    approvedResearch,
    isLinkingModalOpen,
    setIsLinkingModalOpen,
    docToLink,
    setDocToLink,
    editDoc,
    setEditDoc,
    isEditModalOpen,
    setIsEditModalOpen,
    deleteDoc,
    setDeleteDoc,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isMetricsModalOpen,
    setIsMetricsModalOpen,
    filterYear,
    setFilterYear,
    filteredDocuments,
    availableYears,
    stats,
    handleUploadPdf,
    handleDownloadTemplate,
    handleImportExcel,
    loadDocuments,
  };
}
