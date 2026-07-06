import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  VerificationTab, 
  VerificationDocument, 
  VerificationResearch, 
  RejectingItem, 
  PreviewDoc, 
  HistoryModalState,
  SessionUser 
} from '../types/verification.types';
import { 
  fetchPendingDocuments, 
  fetchPendingResearch, 
  verifyItem 
} from '../services/verificationService';

export function useVerification(user: SessionUser) {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  // Tab State
  const [activeTab, setActiveTab] = useState<VerificationTab>('publikasi');

  // Sync tab with URL parameter
  useEffect(() => {
    if (tabParam && ['publikasi', 'hki', 'penelitian', 'buku'].includes(tabParam)) {
      setActiveTab(tabParam as VerificationTab);
    }
  }, [tabParam]);

  // Data States
  const [documents, setDocuments] = useState<VerificationDocument[]>([]);
  const [research, setResearch] = useState<VerificationResearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filter & Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFakultas, setSelectedFakultas] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal States
  const [rejectingItem, setRejectingItem] = useState<RejectingItem | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [previewDoc, setPreviewDoc] = useState<PreviewDoc | null>(null);
  const [historyModal, setHistoryModal] = useState<HistoryModalState>({
    isOpen: false,
    docId: null,
    title: ''
  });

  // Callbacks for Fetching Data
  const getDocuments = useCallback(async () => {
    if (!user?.role || !user?.id) return;
    try {
      setLoading(true);
      const data = await fetchPendingDocuments(user.role, user.id);
      setDocuments(data);
    } catch (err) {
      console.error('Gagal mengambil data dokumen:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getResearch = useCallback(async () => {
    if (!user?.role || !user?.id) return;
    try {
      setLoading(true);
      const data = await fetchPendingResearch(user.role, user.id);
      setResearch(data);
    } catch (err) {
      console.error('Gagal mengambil data penelitian:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Efek untuk memuat data berdasarkan tab atau fakultas terpilih
  useEffect(() => {
    if (activeTab === 'penelitian') {
      getResearch();
    } else {
      getDocuments();
    }
    setCurrentPage(1);
  }, [activeTab, selectedFakultas, getDocuments, getResearch]);

  // Reset pagination ke halaman 1 ketika pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Memfilter log secara lokal berdasarkan kriteria tab aktif
  const filteredDocsByTab = useMemo(() => {
    if (activeTab === 'penelitian') return research;
    if (activeTab === 'hki') {
      return documents.filter((doc) => (doc.category || '').toLowerCase().includes('hki'));
    }
    if (activeTab === 'buku') {
      return documents.filter((doc) => (doc.category || '').toLowerCase().includes('buku'));
    }
    if (activeTab === 'publikasi') {
      return documents.filter((doc) => 
        !(doc.category || '').toLowerCase().includes('hki') && 
        !(doc.category || '').toLowerCase().includes('buku')
      );
    }
    return documents;
  }, [activeTab, documents, research]);

  // Memfilter berdasarkan search term, fakultas, dan melakukan sorting
  const activeItems = useMemo(() => {
    const filtered = filteredDocsByTab.filter((item: any) => {
      const titleText = activeTab === 'penelitian' ? item.judul_penelitian : item.title;
      const authorText = activeTab === 'penelitian' ? item.user?.name : (item.user?.name || item.user_name);
      const catText = activeTab === 'penelitian' ? item.program : item.category;

      const matchSearch = (titleText || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (authorText || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (catText || '').toLowerCase().includes(searchTerm.toLowerCase());

      const itemFakultas = activeTab === 'penelitian' ? item.user?.fakultas : item.fakultas;
      const matchFakultas = selectedFakultas ? itemFakultas === selectedFakultas : true;

      return matchSearch && matchFakultas;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(activeTab === 'penelitian' ? a.tahun : a.published_at).getTime();
      const dateB = new Date(activeTab === 'penelitian' ? b.tahun : b.published_at).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [activeTab, filteredDocsByTab, searchTerm, selectedFakultas, sortOrder]);

  // Logika pagination
  const totalPages = useMemo(() => {
    return Math.ceil(activeItems.length / itemsPerPage);
  }, [activeItems.length, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const currentItems = useMemo(() => {
    return activeItems.slice(indexOfFirstItem, indexOfLastItem);
  }, [activeItems, indexOfFirstItem, indexOfLastItem]);

  // Menjaga agar halaman aktif tidak melebihi total halaman baru
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [activeItems.length, currentPage, totalPages]);

  // Handler Verifikasi Pengajuan
  const handleVerify = useCallback(async (
    docId: string,
    status: 'Approved' | 'Rejected',
    catatan?: string
  ) => {
    if (!user?.role || !user?.id) return;
    try {
      setActionLoading(docId);
      const type = activeTab === 'penelitian' ? 'research' : 'documents';
      const success = await verifyItem(docId, type, status, user.role, user.id, catatan);
      
      if (success) {
        if (activeTab === 'penelitian') {
          await getResearch();
        } else {
          await getDocuments();
        }
      }
    } catch (err) {
      console.error('Gagal memverifikasi dokumen:', err);
    } finally {
      setActionLoading(null);
    }
  }, [activeTab, user, getResearch, getDocuments]);

  // Menangani penolakan pengajuan
  const handleConfirmReject = useCallback(async () => {
    if (!rejectingItem || !feedbackText.trim()) return;
    const docId = rejectingItem.id;
    await handleVerify(docId, 'Rejected', feedbackText);
    setRejectingItem(null);
    setFeedbackText('');
  }, [rejectingItem, feedbackText, handleVerify]);

  return {
    activeTab,
    setActiveTab,
    loading,
    actionLoading,
    searchTerm,
    setSearchTerm,
    selectedFakultas,
    setSelectedFakultas,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalItems: activeItems.length,
    currentItems,
    rejectingItem,
    setRejectingItem,
    feedbackText,
    setFeedbackText,
    previewDoc,
    setPreviewDoc,
    historyModal,
    setHistoryModal,
    handleVerify,
    handleConfirmReject
  };
}
