import { useState, useEffect, useMemo, useCallback, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import type { ResearchItem, UserSession, PreviewDocState, StatsInfo } from '../types/research.types';
import {
  fetchUserResearch,
  createResearch,
  updateResearch,
  deleteResearchItem,
  uploadResearchPdf,
} from '../services/researchService';
import { generateResearchExcelTemplate } from '../utils/researchUtils';
import { formatToYYYYMMDD } from '../../../../components/ui/DatePicker';

export function useResearch(user: UserSession) {
  const location = useLocation();
  const urlKategori = useMemo(() => {
    return new URLSearchParams(location.search).get('kategori') || '';
  }, [location.search]);

  const [researchList, setResearchList] = useState<ResearchItem[]>([]);
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<ResearchItem | null>(null);

  const activeDetailDoc = useMemo(() => {
    if (!selectedDocForDetail) return null;
    return researchList.find((r) => r.id === selectedDocForDetail.id) || selectedDocForDetail;
  }, [researchList, selectedDocForDetail]);

  // Form states untuk Tambah Penelitian
  const [judulPenelitian, setJudulPenelitian] = useState('');
  const [danaDisetujui, setDanaDisetujui] = useState('');

  const [program, setProgram] = useState(() => {
    if (urlKategori === 'Penelitian Hibah Luar Negeri') return 'hibah luar negeri';
    if (urlKategori === 'Penelitian Hibah Eksternal') return 'hibah dikti';
    return 'hibah internal';
  });

  useEffect(() => {
    if (urlKategori === 'Penelitian Hibah Luar Negeri') setProgram('hibah luar negeri');
    else if (urlKategori === 'Penelitian Hibah Eksternal') setProgram('hibah dikti');
    else if (urlKategori === 'Penelitian Internal Institusi') setProgram('hibah internal');
  }, [urlKategori]);

  const [skema, setSkema] = useState('');
  const [fokus, setFokus] = useState('');
  const [tahun, setTahun] = useState<Date | undefined>(new Date());
  const [docType, setDocType] = useState<'kpi' | 'arsip'>('kpi');
  const [file, setFile] = useState<File | null>(null);

  // Loading & Progress states
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Toast notifications
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [isImporting, setIsImporting] = useState(false);
  const [uploadingPdfId, setUploadingPdfId] = useState<number | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMetricsModalOpen, setIsMetricsModalOpen] = useState(false);

  // Preview Modal
  const [previewDoc, setPreviewDoc] = useState<PreviewDocState | null>(null);

  // Edit states
  const [editDoc, setEditDoc] = useState<ResearchItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editJudul, setEditJudul] = useState('');
  const [editDana, setEditDana] = useState('');
  const [editProgram, setEditProgram] = useState('hibah internal');
  const [editSkema, setEditSkema] = useState('');
  const [editFokus, setEditFokus] = useState('');
  const [editTahun, setEditTahun] = useState<Date | undefined>(undefined);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editUploadProgress, setEditUploadProgress] = useState<number | null>(null);

  // Delete states
  const [deleteDoc, setDeleteDoc] = useState<ResearchItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Year filter state
  const [filterYear, setFilterYear] = useState<number | null>(null);

  const showMessage = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4500);
  }, []);

  const loadResearchList = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await fetchUserResearch(user.id);
      setResearchList(data);
    } catch (err) {
      console.error('Error fetching research list:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    const initData = async () => {
      setIsTableLoading(true);
      await loadResearchList();
      setIsTableLoading(false);
    };
    initData();
  }, [loadResearchList]);

  useEffect(() => {
    if (urlKategori) {
      setFilterYear(null);
      setCurrentPage(1);
    }
  }, [urlKategori]);

  const filteredResearchList = useMemo(() => {
    let result = researchList;

    if (urlKategori) {
      const catLower = urlKategori.toLowerCase();
      if (catLower.includes('luar negeri')) {
        result = result.filter((r) => (r.program || '').toLowerCase() === 'hibah luar negeri');
      } else if (catLower.includes('eksternal') || catLower.includes('dikti')) {
        result = result.filter((r) => (r.program || '').toLowerCase() === 'hibah dikti');
      } else if (catLower.includes('internal') || catLower.includes('institusi')) {
        result = result.filter((r) => (r.program || '').toLowerCase() === 'hibah internal');
      }
    }

    if (filterYear) {
      result = result.filter((r) => {
        const y = Number(r.tahun);
        return y === filterYear;
      });
    }

    return result;
  }, [researchList, urlKategori, filterYear]);

  const availableYears = useMemo(() => {
    const yearsSet = new Set<number>();
    researchList.forEach((r) => {
      const y = Number(r.tahun);
      if (!isNaN(y) && y > 1900 && y <= 2100) {
        yearsSet.add(y);
      }
    });
    return Array.from(yearsSet).sort((a, b) => b - a);
  }, [researchList]);

  const stats: StatsInfo = useMemo(() => {
    const src = filteredResearchList;
    return {
      total: src.length,
      approved: src.filter((r) => r.status === 'Approved').length,
      pending: src.filter((r) => r.status === 'Pending' || r.status === 'Verified by Fakultas').length,
      points: Math.round(src.reduce((acc, r) => acc + (Number(r.awarded_points) || 0), 0)),
      totalDana: src.reduce((acc, r) => acc + (Number(r.dana_disetujui) || 0), 0),
    };
  }, [filteredResearchList]);

  // Handler Submit Upload Penelitian Baru
  const handleUpload = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    if (!judulPenelitian || !danaDisetujui || !program || !skema || !fokus || !tahun || !file) {
      showMessage('Harap isi semua data termasuk file PDF.', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showMessage('Ukuran file maksimal 10MB.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('judul_penelitian', judulPenelitian.trim());
    formData.append('dana_disetujui', danaDisetujui.replace(/\./g, ''));
    formData.append('user_id', String(user.id));
    formData.append('program', program);
    formData.append('skema', skema);
    formData.append('fokus', fokus);
    formData.append('tahun', tahun ? formatToYYYYMMDD(tahun) : '');
    formData.append('doc_type', docType);

    try {
      setLoading(true);
      setUploadProgress(0);

      const res = await createResearch(formData, setUploadProgress);

      if (res.ok) {
        await new Promise((r) => setTimeout(r, 400));
        showMessage(res.data?.message || 'Penelitian berhasil diunggah!', 'success');
        setJudulPenelitian('');
        setDanaDisetujui('');
        setSkema('');
        setFokus('');
        setFile(null);
        setTahun(new Date());
        setDocType('kpi');
        setIsUploadModalOpen(false);

        setIsTableLoading(true);
        await loadResearchList();
        setIsTableLoading(false);
      } else {
        showMessage(res.data?.message || 'Gagal menambahkan penelitian.', 'error');
      }
    } catch (err) {
      console.error('Upload research error:', err);
      showMessage('Terjadi kesalahan koneksi saat mengunggah.', 'error');
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  }, [judulPenelitian, danaDisetujui, program, skema, fokus, tahun, file, docType, user?.id, showMessage, loadResearchList]);

  // Handler Open Edit Modal
  const openEditModal = useCallback((resDoc: ResearchItem) => {
    setEditDoc(resDoc);
    setEditJudul(resDoc.judul_penelitian || '');
    setEditDana(resDoc.dana_disetujui ? Number(resDoc.dana_disetujui).toLocaleString('id-ID') : '');
    setEditProgram(resDoc.program || 'hibah internal');
    setEditSkema(resDoc.skema || '');
    setEditFokus(resDoc.fokus || '');
    setEditTahun(resDoc.tahun ? new Date(resDoc.tahun) : new Date());
    setEditFile(null);
    setIsEditModalOpen(true);
  }, []);

  // Handler Submit Update Penelitian
  const handleUpdate = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!editDoc) return;

    if (!editJudul || !editDana || !editProgram || !editSkema || !editFokus || !editTahun) {
      showMessage('Harap lengkapi semua field.', 'error');
      return;
    }

    try {
      setIsEditLoading(true);
      setEditUploadProgress(0);

      const formData = new FormData();
      formData.append('judul_penelitian', editJudul.trim());
      formData.append('dana_disetujui', editDana.replace(/\./g, ''));
      formData.append('program', editProgram);
      formData.append('skema', editSkema);
      formData.append('fokus', editFokus);
      formData.append('tahun', editTahun ? formatToYYYYMMDD(editTahun) : '');
      if (editFile) {
        formData.append('file', editFile);
      }

      const res = await updateResearch(editDoc.id, formData, setEditUploadProgress);

      if (res.ok) {
        await new Promise((r) => setTimeout(r, 400));
        showMessage(res.data?.message || 'Penelitian berhasil diperbarui!', 'success');
        setEditFile(null);
        setIsEditModalOpen(false);
        setEditDoc(null);

        setIsTableLoading(true);
        await loadResearchList();
        setIsTableLoading(false);
      } else {
        showMessage(res.data?.message || 'Gagal memperbarui penelitian.', 'error');
      }
    } catch (err) {
      console.error('Update research error:', err);
      showMessage('Terjadi kesalahan saat memperbarui.', 'error');
    } finally {
      setIsEditLoading(false);
      setEditUploadProgress(null);
    }
  }, [editDoc, editJudul, editDana, editProgram, editSkema, editFokus, editTahun, editFile, showMessage, loadResearchList]);

  // Upload PDF Bukti tambahan pada tabel
  const handleUploadPdf = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const fileInput = e.target.files?.[0];
    if (!fileInput) return;

    if (!fileInput.type.includes('pdf') && !fileInput.type.includes('image')) {
      showMessage('Hanya file PDF atau gambar yang diperbolehkan.', 'error');
      return;
    }

    if (fileInput.size > 10 * 1024 * 1024) {
      showMessage('Ukuran file maksimal 10MB.', 'error');
      return;
    }

    setUploadingPdfId(id);
    const formData = new FormData();
    formData.append('file', fileInput);

    try {
      const res = await uploadResearchPdf(id, formData);
      if (res.ok) {
        showMessage('Dokumen berhasil diunggah!', 'success');
        setIsTableLoading(true);
        await loadResearchList();
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
  }, [showMessage, loadResearchList]);

  const handleDeleteSubmit = useCallback(async () => {
    if (!deleteDoc) return;
    setIsDeleteLoading(true);
    try {
      const res = await deleteResearchItem(deleteDoc.id);
      if (res.ok) {
        showMessage('Penelitian berhasil dihapus!', 'success');
        setIsTableLoading(true);
        await loadResearchList();
        setIsTableLoading(false);
        setIsDeleteModalOpen(false);
        setDeleteDoc(null);
      } else {
        showMessage(res.data?.message || 'Gagal menghapus penelitian.', 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Terjadi kesalahan koneksi saat menghapus.', 'error');
    } finally {
      setIsDeleteLoading(false);
    }
  }, [deleteDoc, showMessage, loadResearchList]);

  const handleDownloadTemplate = useCallback(async () => {
    await generateResearchExcelTemplate();
  }, []);

  return {
    urlKategori,
    researchList,
    selectedDocForDetail,
    setSelectedDocForDetail,
    activeDetailDoc,
    judulPenelitian,
    setJudulPenelitian,
    danaDisetujui,
    setDanaDisetujui,
    program,
    setProgram,
    skema,
    setSkema,
    fokus,
    setFokus,
    tahun,
    setTahun,
    docType,
    setDocType,
    file,
    setFile,
    isTableLoading,
    setIsTableLoading,
    loading,
    uploadProgress,
    message,
    messageType,
    showMessage,
    isImporting,
    setIsImporting,
    uploadingPdfId,
    isUploadModalOpen,
    setIsUploadModalOpen,
    isMetricsModalOpen,
    setIsMetricsModalOpen,
    previewDoc,
    setPreviewDoc,
    editDoc,
    setEditDoc,
    isEditModalOpen,
    setIsEditModalOpen,
    editJudul,
    setEditJudul,
    editDana,
    setEditDana,
    editProgram,
    setEditProgram,
    editSkema,
    setEditSkema,
    editFokus,
    setEditFokus,
    editTahun,
    setEditTahun,
    editFile,
    setEditFile,
    isEditLoading,
    editUploadProgress,
    deleteDoc,
    setDeleteDoc,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDeleteLoading,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    filterYear,
    setFilterYear,
    filteredResearchList,
    availableYears,
    stats,
    handleUpload,
    openEditModal,
    handleUpdate,
    handleUploadPdf,
    handleDeleteSubmit,
    handleDownloadTemplate,
    loadResearchList,
  };
}
