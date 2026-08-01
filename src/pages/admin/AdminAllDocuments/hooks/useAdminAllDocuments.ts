import { useState, useEffect, useMemo, useCallback } from 'react';
import { FileText, Award, Beaker, Book } from 'lucide-react';
import type {
  DocTab, AllDocumentItem, AllResearchItem, SessionUser,
  PreviewDocState, HistoryModalState, TabDetailInfo
} from '../types/adminAllDocuments.types';
import { fetchAllAdminDocuments, fetchAllAdminResearch } from '../services/adminAllDocumentsService';
import {
  getFilteredDataForTab, getDocCategory, exportAllDocumentsToExcel
} from '../utils/adminAllDocumentsUtils';

export function useAdminAllDocuments(user: SessionUser) {
  const [activeTab, setActiveTab] = useState<DocTab>('publikasi');
  const [documents, setDocuments] = useState<AllDocumentItem[]>([]);
  const [research, setResearch] = useState<AllResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFakultas, setSelectedFakultas] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals State
  const [previewDoc, setPreviewDoc] = useState<PreviewDocState | null>(null);
  const [historyModal, setHistoryModal] = useState<HistoryModalState>({
    isOpen: false,
    docId: null,
    title: ''
  });

  const tabDetails: Record<DocTab, TabDetailInfo> = useMemo(() => ({
    publikasi: {
      title: 'Daftar Publikasi',
      description: 'Pengelolaan Publikasi: Kelola, monitoring, dan validasi data publikasi ilmiah dosen.',
      icon: FileText,
      colorClass: 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 border-primary-100/50 dark:border-primary-900/30'
    },
    hki: {
      title: 'Daftar HKI',
      description: 'Pengelolaan HKI: Kelola, monitoring, dan verifikasi data hak kekayaan intelektual dosen.',
      icon: Award,
      colorClass: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100/50 dark:border-indigo-900/30'
    },
    penelitian: {
      title: 'Daftar Penelitian',
      description: 'Pengelolaan Penelitian: Kelola, monitoring, dan laporan data penelitian dosen.',
      icon: Beaker,
      colorClass: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100/50 dark:border-emerald-900/30'
    },
    buku: {
      title: 'Daftar Buku',
      description: 'Pengelolaan Buku: Kelola, monitoring, dan verifikasi data buku akademik dosen.',
      icon: Book,
      colorClass: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-100/50 dark:border-amber-900/30'
    }
  }), []);

  // Fetch initial data
  const loadData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [docsData, researchData] = await Promise.all([
        fetchAllAdminDocuments(user.role, user.id),
        fetchAllAdminResearch(user.role, user.id)
      ]);
      setDocuments(docsData);
      setResearch(researchData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.role]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset page when search or fakultas changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFakultas]);

  // Filtered documents by tab
  const filteredDocsByTab = useMemo(() => {
    if (activeTab === 'penelitian') return research;
    if (activeTab === 'hki') {
      return documents.filter((doc) => getDocCategory(doc, activeTab).toLowerCase().includes('hki'));
    }
    if (activeTab === 'buku') {
      return documents.filter((doc) => getDocCategory(doc, activeTab).toLowerCase().includes('buku'));
    }
    if (activeTab === 'publikasi') {
      return documents.filter((doc) => {
        const cat = getDocCategory(doc, activeTab).toLowerCase();
        return !cat.includes('hki') && !cat.includes('buku');
      });
    }
    return documents;
  }, [activeTab, documents, research]);

  const filteredDocuments = useMemo(() => {
    const data = getFilteredDataForTab(activeTab, documents, research, searchTerm, selectedFakultas);
    return data.sort((a, b) => {
      const dateA = new Date(activeTab === 'penelitian' ? a.tahun : a.published_at).getTime();
      const dateB = new Date(activeTab === 'penelitian' ? b.tahun : b.published_at).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [activeTab, documents, research, searchTerm, selectedFakultas, sortOrder]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = useMemo(
    () => filteredDocuments.slice(indexOfFirstItem, indexOfLastItem),
    [filteredDocuments, indexOfFirstItem, indexOfLastItem]
  );

  const handleExportExcel = useCallback(async () => {
    await exportAllDocumentsToExcel(documents, research, user, selectedFakultas, searchTerm);
  }, [documents, research, user, selectedFakultas, searchTerm]);

  // Summary Card Stats
  const totalCount = filteredDocsByTab.length;
  const approvedCount = useMemo(() => filteredDocsByTab.filter(d => d.status === 'Approved').length, [filteredDocsByTab]);
  const pendingCount = useMemo(() => filteredDocsByTab.filter(d => d.status === 'Pending' || d.status === 'Verified by Fakultas').length, [filteredDocsByTab]);

  return {
    activeTab,
    setActiveTab,
    documents,
    research,
    loading,
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
    indexOfFirstItem,
    indexOfLastItem,
    filteredDocuments,
    currentItems,
    previewDoc,
    setPreviewDoc,
    historyModal,
    setHistoryModal,
    tabDetails,
    totalCount,
    approvedCount,
    pendingCount,
    handleExportExcel,
  };
}
