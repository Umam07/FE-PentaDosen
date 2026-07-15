import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, Globe, FileText } from 'lucide-react';
import { LecturerProfile, StatItem, ChartDataResult } from '../types';
import { InternalDocument } from '../../../dosen/dashboard/components/internal-documents/internal-documents.types';
import { getLecturerProfileAndDocs } from '../services/lecturerProfileService';
import { calculateScholarPoints } from '../../../dosen/dashboard/pointsCalculator';
import { normalizeTitle, calculateScopusSintaPoints } from '../utils/pointsCalculator';
import { aggregateChartData } from '../utils/chartHelpers';

export const useLecturerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<LecturerProfile | null>(null);
  const [documents, setDocuments] = useState<InternalDocument[]>([]);
  const [activeView, setActiveView] = useState<'external' | 'internal'>('external');
  const [publicationSubTab, setPublicationSubTab] = useState<'scopus' | 'scholar' | 'cross_indexed' | 'metriks'>('scopus');
  const [categoryFilter, setCategoryFilter] = useState<string>('penelitian');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchProfileAndDocs = useCallback(() => {
    if (id) {
      setLoading(true);
      getLecturerProfileAndDocs(id)
        .then(({ profile: profileRes, documents: docsRes }) => {
          setProfile(profileRes);
          setDocuments(docsRes || []);
        })
        .catch(err => {
          console.error('Failed to fetch profile data', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    fetchProfileAndDocs();
  }, [id, fetchProfileAndDocs]);

  // Kalkulasi total poin KPI (overall & tahun ini)
  const stats = useMemo<StatItem[] | null>(() => {
    if (!profile || !profile.user) return null;

    const { publications = [], scopusPublications = [] } = profile;
    const currentYear = 2026; // Tahun KPI aktif saat ini
    
    // --- 1. OVERALL CALCULATION ---
    // Identifikasi judul publikasi yang saling beririsan (cross-indexed)
    const crossTitles = new Set(
      publications
        .filter(sd => scopusPublications.some(s => normalizeTitle(s.title) === normalizeTitle(sd.title)))
        .map(d => normalizeTitle(d.title))
    );

    const extCross = scopusPublications
      .filter(s => crossTitles.has(normalizeTitle(s.title)))
      .reduce((a, d) => a + calculateScopusSintaPoints(d), 0);

    const extScopus = scopusPublications
      .filter(s => !crossTitles.has(normalizeTitle(s.title)))
      .reduce((a, d) => a + calculateScopusSintaPoints(d), 0);

    const extScholar = publications
      .filter(s => !crossTitles.has(normalizeTitle(s.title)))
      .reduce((a, d) => a + calculateScholarPoints(d), 0);

    const apiOverall = Math.round(extCross + extScopus + extScholar);

    // Hitung poin dokumen internal yang berstatus Approved dan memiliki file_url
    const internalOverall = Math.round(
      documents
        .filter(d => d.status === 'Approved' && d.file_url && d.file_url !== '')
        .reduce((acc, d) => acc + (Number(d.awarded_points) || 0), 0)
    );

    // --- 2. THIS YEAR (2026) CALCULATION ---
    const publicationsThisYear = publications.filter(p => Number(p.year) === currentYear);
    const scopusThisYear = scopusPublications.filter(s => Number(s.year) === currentYear);

    const crossTitlesThisYear = new Set(
      publicationsThisYear
        .filter(sd => scopusThisYear.some(s => normalizeTitle(s.title) === normalizeTitle(sd.title)))
        .map(d => normalizeTitle(d.title))
    );

    const extCrossThisYear = scopusThisYear
      .filter(s => crossTitlesThisYear.has(normalizeTitle(s.title)))
      .reduce((a, d) => a + calculateScopusSintaPoints(d), 0);

    const extScopusThisYear = scopusThisYear
      .filter(s => !crossTitlesThisYear.has(normalizeTitle(s.title)))
      .reduce((a, d) => a + calculateScopusSintaPoints(d), 0);

    const extScholarThisYear = publicationsThisYear
      .filter(s => !crossTitlesThisYear.has(normalizeTitle(s.title)))
      .reduce((a, d) => a + calculateScholarPoints(d), 0);

    const apiThisYear = Math.round(extCrossThisYear + extScopusThisYear + extScholarThisYear);

    const internalThisYear = Math.round(
      documents
        .filter(d => d.status === 'Approved' && d.file_url && d.file_url !== '' && new Date(d.published_at).getFullYear() === currentYear)
        .reduce((acc, d) => acc + (Number(d.awarded_points) || 0), 0)
    );

    return [
      { 
        label: 'Total KPI Overall', 
        val: (apiOverall + internalOverall).toLocaleString(), 
        icon: Award, 
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
      },
      { 
        label: 'Total KPI Tahun Ini',
        val: (apiThisYear + internalThisYear).toLocaleString(),
        icon: Globe, 
        color: 'bg-primary-500/10 text-primary-600 dark:text-primary-400' 
      },
      { 
        label: 'Poin (Internal)',
        val: internalOverall.toLocaleString(),
        icon: FileText, 
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
      }
    ];
  }, [profile, documents]);

  // Kalkulasi data grafik Google Scholar
  const scholarChartData = useMemo<ChartDataResult>(() => {
    return aggregateChartData(profile?.publications || []);
  }, [profile]);

  // Kalkulasi data grafik Scopus
  const scopusChartData = useMemo<ChartDataResult>(() => {
    return aggregateChartData(profile?.scopusPublications || []);
  }, [profile]);

  // Hanya ambil dokumen internal yang disetujui
  const internalDocumentsOnly = useMemo<InternalDocument[]>(() => {
    return documents.filter(d => d.status === 'Approved' && d.file_url && d.file_url !== '');
  }, [documents]);

  // Filter dokumen berdasarkan kategori
  const filteredDocs = useMemo<InternalDocument[]>(() => {
    if (categoryFilter === 'all') return internalDocumentsOnly;
    return internalDocumentsOnly.filter(d => d.category?.toLowerCase() === categoryFilter.toLowerCase());
  }, [internalDocumentsOnly, categoryFilter]);

  return {
    id,
    navigate,
    loading,
    profile,
    documents,
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
    stats,
    scholarChartData,
    scopusChartData,
    internalDocumentsOnly,
    filteredDocs,
    fetchProfileAndDocs
  };
};
