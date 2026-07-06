import { useState, useEffect, useMemo, useCallback } from 'react';
import { LecturerProfileData } from '../types/lecturerProfile.types';
import { fetchProfileAndDocuments } from '../services/lecturerProfileService';
import { calculateKPIStats, formatChartData } from '../utils/lecturerProfileUtils';

export function useLecturerProfile(id: string | undefined) {
  const [profile, setProfile] = useState<LecturerProfileData | null>(null);
  const [internalDocuments, setInternalDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const [activeView, setActiveView] = useState<'external' | 'internal'>('external');
  const [publicationSubTab, setPublicationSubTab] = useState<'scopus' | 'scholar' | 'cross_indexed' | 'metriks'>('scopus');
  const [categoryFilter, setCategoryFilter] = useState<string>('penelitian');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mengambil profil dan dokumen dosen dari API
  const loadProfileAndDocs = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await fetchProfileAndDocuments(id);
      setInternalDocuments(data.internalDocs);
      setProfile(data.profile);
    } catch (err) {
      console.error('Gagal memuat detail profil dosen:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProfileAndDocs();
  }, [loadProfileAndDocs]);

  // Memfilter dokumen internal yang memiliki file URL saja
  const internalDocumentsOnly = useMemo(() => {
    return internalDocuments.filter(doc => doc.file_url && doc.file_url !== '');
  }, [internalDocuments]);

  // Mengambil dokumen terfilter berdasarkan kategori filter terpilih
  const filteredDocs = useMemo(() => {
    const base = internalDocumentsOnly;
    if (categoryFilter === 'all') return base;
    return base.filter(doc => doc.category?.toLowerCase().includes(categoryFilter.toLowerCase()));
  }, [internalDocumentsOnly, categoryFilter]);

  // Melakukan kalkulasi statistik KPI
  const stats = useMemo(() => {
    return calculateKPIStats(profile, internalDocuments);
  }, [profile, internalDocuments]);

  // Menyiapkan data chart Google Scholar
  const scholarChartData = useMemo(() => {
    return formatChartData(profile?.publications || []);
  }, [profile?.publications]);

  // Menyiapkan data chart Scopus
  const scopusChartData = useMemo(() => {
    return formatChartData(profile?.scopusPublications || []);
  }, [profile?.scopusPublications]);

  return {
    profile,
    internalDocuments,
    internalDocumentsOnly,
    filteredDocs,
    stats,
    scholarChartData,
    scopusChartData,
    loading,
    message,
    setMessage,
    activeView,
    setActiveView,
    publicationSubTab,
    setPublicationSubTab,
    categoryFilter,
    setCategoryFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    loadProfileAndDocs
  };
}
