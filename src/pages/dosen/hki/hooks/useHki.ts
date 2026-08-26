import { useState, useEffect, useMemo, useCallback } from 'react';
import type { HkiDoc, ApprovedResearch, WeightCategory, UserSession, PreviewDocState, StatsInfo } from '../types/hki.types';
import { fetchUserHkiDocuments, fetchCategoryWeights, fetchApprovedResearch, uploadHkiPdf } from '../services/hkiService';
import { generateHkiExcelTemplate } from '../utils/hkiUtils';

export function useHki(user: UserSession) {
  const [documents, setDocuments] = useState<HkiDoc[]>(() => {
    if (!user?.id) return [];
    try {
      const cached = sessionStorage.getItem(`pentadosen_hki_${user.id}`);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<HkiDoc | null>(null);

  const activeDetailDoc = useMemo(() => {
    if (!selectedDocForDetail) return null;
    return documents.find((d) => d.id === selectedDocForDetail.id) || selectedDocForDetail;
  }, [documents, selectedDocForDetail]);

  const [weights, setWeights] = useState<WeightCategory[]>(() => {
    try {
      const cached = localStorage.getItem('penta_weights');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });

  const [isTableLoading, setIsTableLoading] = useState(() => {
    if (!user?.id) return true;
    try {
      const cached = sessionStorage.getItem(`pentadosen_hki_${user.id}`);
      return !cached;
    } catch {
      return true;
    }
  });
  const [isWeightsLoading, setIsWeightsLoading] = useState(() => {
    try {
      return !localStorage.getItem('penta_weights');
    } catch (e) {
      return true;
    }
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isImporting, setIsImporting] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);
  const [uploadingPdfId, setUploadingPdfId] = useState<number | null>(null);

  const [previewDoc, setPreviewDoc] = useState<PreviewDocState | null>(null);

  // Edit modal
  const [editDoc, setEditDoc] = useState<HkiDoc | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Delete modal
  const [deleteDoc, setDeleteDoc] = useState<HkiDoc | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Linking research modal
  const [approvedResearch, setApprovedResearch] = useState<ApprovedResearch[]>([]);
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
  const [docToLink, setDocToLink] = useState<HkiDoc | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterYear, setFilterYear] = useState<number | null>(null);

  const showMessage = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4500);
  }, []);

  const loadDocuments = useCallback(async () => {
    if (!user?.id) return;
    try {
      const docs = await fetchUserHkiDocuments(user.id);
      setDocuments(docs);
      try {
        sessionStorage.setItem(`pentadosen_hki_${user.id}`, JSON.stringify(docs));
      } catch (e) {}
    } catch (err) {
      console.error('Error fetching HKI documents:', err);
    }
  }, [user?.id]);

  const loadWeights = useCallback(async () => {
    if (!localStorage.getItem('penta_weights')) {
      setIsWeightsLoading(true);
    }
    try {
      const weightsData = await fetchCategoryWeights();
      setWeights(weightsData);
      localStorage.setItem('penta_weights', JSON.stringify(weightsData));
    } catch (err) {
      console.error('Error fetching weights:', err);
    } finally {
      setIsWeightsLoading(false);
    }
  }, []);

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
      const hasCache = !!sessionStorage.getItem(`pentadosen_hki_${user?.id}`);
      if (!hasCache) {
        setIsTableLoading(true);
      }
      await Promise.all([loadWeights(), loadApprovedResearch(), loadDocuments()]);
      setIsTableLoading(false);
    };
    initData();
  }, [loadWeights, loadApprovedResearch, loadDocuments, user?.id]);

  const hkiDocs = useMemo(() => {
    return (documents || []).filter((d) =>
      (d.category || '').toLowerCase().includes('hki')
    );
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    if (!filterYear) return hkiDocs;
    return hkiDocs.filter((d) => {
      const y = d.published_at ? new Date(d.published_at).getFullYear() : null;
      return y === filterYear;
    });
  }, [hkiDocs, filterYear]);

  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    hkiDocs.forEach((d) => {
      if (d.published_at) {
        const y = new Date(d.published_at).getFullYear();
        if (!isNaN(y) && y > 1900 && y <= 2100) {
          yearsSet.add(y);
        }
      }
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [hkiDocs]);

  const stats: StatsInfo = useMemo(() => {
    const src = filteredDocuments;
    return {
      total: src.length,
      approved: src.filter((d) => d.status === 'Approved').length,
      pending: src.filter((d) => d.status === 'Pending' || d.status === 'Verified by Fakultas').length,
      points: Math.round(src.reduce((acc, d) => acc + (Number(d.awarded_points) || 0), 0)),
    };
  }, [filteredDocuments]);

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
      const res = await uploadHkiPdf(id, formData);
      if (res.ok) {
        showMessage('Dokumen HKI berhasil diunggah!', 'success');
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
    await generateHkiExcelTemplate();
  }, []);

  const handleImportExcel = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    showMessage('Membaca file excel...', 'success');

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const XLSX = await import('xlsx');
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
          formData.append('title', row['Judul HKI'] || '');
          formData.append('category', row['Kategori HKI'] || 'HKI Hak Cipta');
          formData.append('published_at', `${row['Tahun Perolehan'] || new Date().getFullYear()}-01-01`);
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
          showMessage(`Berhasil mengimpor ${successCount} HKI.${failCount > 0 ? ` (${failCount} gagal)` : ''}`, 'success');
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
    documents,
    selectedDocForDetail,
    setSelectedDocForDetail,
    activeDetailDoc,
    weights,
    isTableLoading,
    setIsTableLoading,
    isWeightsLoading,
    message,
    messageType,
    showMessage,
    isImporting,
    isUploadModalOpen,
    setIsUploadModalOpen,
    isMetricsModalOpen,
    setIsMetricsModalOpen,
    uploadingPdfId,
    previewDoc,
    setPreviewDoc,
    editDoc,
    setEditDoc,
    isEditModalOpen,
    setIsEditModalOpen,
    deleteDoc,
    setDeleteDoc,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    approvedResearch,
    isLinkingModalOpen,
    setIsLinkingModalOpen,
    docToLink,
    setDocToLink,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
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
