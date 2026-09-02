import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, Globe, FileText, TrendingUp } from 'lucide-react';
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

  // Kalkulasi total poin KPI (overall, 3 tahun, tahun ini, dan kontribusi)
  const pointMetrics = useMemo(() => {
    if (!profile || !profile.user) {
      return {
        grandTotal: 0,
        grandTotal3Years: 0,
        grandTotalThisYear: 0,
        internalPoints: 0,
        apiPointsTotal: 0,
        stats: null,
      };
    }

    const { publications = [], scopusPublications = [] } = profile;
    const currentYear = 2026; // Tahun KPI aktif saat ini
    
    // --- 1. OVERALL CALCULATION ---
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

    const internalOverall = Math.round(
      documents
        .filter(d => {
          if (d.status !== 'Approved') return false;
          if ((d as any).source === 'scopus' || (d as any).source === 'scholar' || d.category === 'Google Scholar') return false;
          return ((d.file_url && d.file_url !== '' && d.file_url !== '-') || (d as any).is_penelitian);
        })
        .reduce((acc, d) => acc + (Number(d.awarded_points) || 0), 0)
    );

    // --- 2. 3 YEARS (2024-2026) CALCULATION ---
    const publications3Years = publications.filter(p => {
      const yr = Number(p.year);
      return yr >= currentYear - 2 && yr <= currentYear;
    });
    const scopus3Years = scopusPublications.filter(s => {
      const yr = Number(s.year);
      return yr >= currentYear - 2 && yr <= currentYear;
    });

    const crossTitles3Years = new Set(
      publications3Years
        .filter(sd => scopus3Years.some(s => normalizeTitle(s.title) === normalizeTitle(sd.title)))
        .map(d => normalizeTitle(d.title))
    );

    const extCross3Years = scopus3Years
      .filter(s => crossTitles3Years.has(normalizeTitle(s.title)))
      .reduce((a, d) => a + calculateScopusSintaPoints(d), 0);

    const extScopus3Years = scopus3Years
      .filter(s => !crossTitles3Years.has(normalizeTitle(s.title)))
      .reduce((a, d) => a + calculateScopusSintaPoints(d), 0);

    const extScholar3Years = publications3Years
      .filter(s => !crossTitles3Years.has(normalizeTitle(s.title)))
      .reduce((a, d) => a + calculateScholarPoints(d), 0);

    const api3Years = Math.round(extCross3Years + extScopus3Years + extScholar3Years);

    const internal3Years = Math.round(
      documents
        .filter(d => {
          if (d.status !== 'Approved') return false;
          if ((d as any).source === 'scopus' || (d as any).source === 'scholar' || d.category === 'Google Scholar') return false;
          if (!((d.file_url && d.file_url !== '' && d.file_url !== '-') || (d as any).is_penelitian)) return false;
          const docYear = d.published_at ? new Date(d.published_at).getFullYear() : (d as any).tahun_pelaksanaan;
          const yr = Number(docYear);
          return yr >= currentYear - 2 && yr <= currentYear;
        })
        .reduce((acc, d) => acc + (Number(d.awarded_points) || 0), 0)
    );

    // --- 3. THIS YEAR (2026) CALCULATION ---
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
        .filter(d => {
          if (d.status !== 'Approved') return false;
          if ((d as any).source === 'scopus' || (d as any).source === 'scholar' || d.category === 'Google Scholar') return false;
          if (!((d.file_url && d.file_url !== '' && d.file_url !== '-') || (d as any).is_penelitian)) return false;
          const docYear = d.published_at ? new Date(d.published_at).getFullYear() : (d as any).tahun_pelaksanaan;
          return Number(docYear) === currentYear;
        })
        .reduce((acc, d) => acc + (Number(d.awarded_points) || 0), 0)
    );

    const grandTotal = apiOverall + internalOverall;
    const grandTotal3Years = api3Years + internal3Years;
    const grandTotalThisYear = apiThisYear + internalThisYear;

    const stats: StatItem[] = [
      { 
        label: 'Total KPI Overall', 
        val: grandTotal.toLocaleString(), 
        icon: Award, 
        color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
      },
      { 
        label: 'Total KPI 3 Tahun',
        val: grandTotal3Years.toLocaleString(),
        icon: TrendingUp, 
        color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
      },
      { 
        label: 'Total KPI Tahun Ini',
        val: grandTotalThisYear.toLocaleString(),
        icon: Globe, 
        color: 'bg-primary-500/10 text-primary-600 dark:text-primary-400' 
      }
    ];

    return {
      grandTotal,
      grandTotal3Years,
      grandTotalThisYear,
      internalPoints: internalOverall,
      apiPointsTotal: apiOverall,
      stats,
    };
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
    return documents.filter(d => {
      if (d.status !== 'Approved') return false;
      if ((d as any).source === 'scopus' || (d as any).source === 'scholar' || d.category === 'Google Scholar') return false;
      return (d.file_url && d.file_url !== '' && d.file_url !== '-') || (d as any).is_penelitian;
    });
  }, [documents]);

  // Filter dokumen berdasarkan kategori
  const filteredDocs = useMemo<InternalDocument[]>(() => {
    if (categoryFilter === 'all') return internalDocumentsOnly;
    return internalDocumentsOnly.filter(d => d.category?.toLowerCase().includes(categoryFilter.toLowerCase()));
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
    stats: pointMetrics.stats,
    grandTotal: pointMetrics.grandTotal,
    grandTotal3Years: pointMetrics.grandTotal3Years,
    grandTotalThisYear: pointMetrics.grandTotalThisYear,
    internalPoints: pointMetrics.internalPoints,
    apiPointsTotal: pointMetrics.apiPointsTotal,
    scholarChartData,
    scopusChartData,
    internalDocumentsOnly,
    filteredDocs,
    fetchProfileAndDocs
  };
};
