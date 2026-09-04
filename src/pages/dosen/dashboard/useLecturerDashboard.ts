import { useState, useEffect, useMemo } from 'react';
import { FileText, Globe, TrendingUp } from 'lucide-react';
import { 
  calculateScopusSintaPoints, 
  calculateScholarPoints, 
  normalizeTitle 
} from './pointsCalculator';

export default function useLecturerDashboard(user: any) {
  const [internalDocuments, setInternalDocuments] = useState<any[]>(() => {
    if (!user?.id) return [];
    try {
      const cached = sessionStorage.getItem(`pentadosen_docs_${user.id}`);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [profileData, setProfileData] = useState<any>(() => {
    if (!user?.id) return null;
    try {
      const cached = sessionStorage.getItem(`pentadosen_profile_${user.id}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(() => {
    if (!user?.id) return true;
    try {
      const cached = sessionStorage.getItem(`pentadosen_profile_${user.id}`);
      return !cached;
    } catch {
      return true;
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState<string>('jurnal internasional');
  const [activeView, setActiveView] = useState<'internal' | 'external'>('external');
  const [publicationSubTab, setPublicationSubTab] = useState<'scopus' | 'scholar' | 'cross_indexed' | 'metriks'>('scopus');

  const fetchData = async () => {
    if (!user?.id) return;
    if (!profileData) {
      setLoading(true);
    }
    try {
      const [docsRes, profileRes, penRes] = await Promise.all([
        fetch(`/api/users/${user.id}/documents`),
        fetch(`/api/users/${user.id}`),
        fetch(`/api/penelitian?user_id=${user.id}`)
      ]);

      let combinedDocs: any[] = [];

      if (docsRes.ok) {
        const data = await docsRes.json();
        combinedDocs = [...(data.documents || [])];
      }

      if (penRes.ok) {
        const data = await penRes.json();
        const penDocs = (data.penelitian || []).map((p: any) => ({
          ...p,
          id_dokumen: 'RESEARCH-' + p.id,
          category: 'Penelitian',
          title: p.judul_penelitian,
          published_at: null,
          tahun_pelaksanaan: p.tahun,
          is_penelitian: true,
        }));
        combinedDocs = [...combinedDocs, ...penDocs];
      }

      setInternalDocuments(combinedDocs);
      try {
        sessionStorage.setItem(`pentadosen_docs_${user.id}`, JSON.stringify(combinedDocs));
      } catch (e) {}

      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfileData(data);
        try {
          sessionStorage.setItem(`pentadosen_profile_${user.id}`, JSON.stringify(data));
        } catch (e) {}
      }

    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const internalDocumentsOnly = useMemo(() => {
    return internalDocuments.filter(doc => {
      if (doc.source === 'scopus' || doc.source === 'scholar' || doc.category === 'Google Scholar') return false;
      return (doc.file_url && doc.file_url !== '' && doc.file_url !== '-') || doc.is_penelitian;
    });
  }, [internalDocuments]);

  const approvedDocs = useMemo(() => {
    return internalDocumentsOnly.filter(doc => doc.status === 'Approved');
  }, [internalDocumentsOnly]);

  const currentYear = 2026;

  // --- 1. OVERALL CALCULATION ---
  const apiPoints = useMemo(() => {
    if (!profileData) return { total: 0, scopus: 0, scholar: 0 };
    
    const { publications = [], scopusPublications = [] } = profileData;
    const manualApprovedTitles = new Set(
      approvedDocs.map((d: any) => normalizeTitle(d.title)).filter(Boolean)
    );

    const crossTitles = new Set(
      (publications || []).filter((sd: any) => 
        (scopusPublications || []).some((s: any) => normalizeTitle(s.title) === normalizeTitle(sd.title))
      ).map((d: any) => normalizeTitle(d.title))
    );
    
    const scopusPts = (scopusPublications || [])
      .filter((s: any) => !manualApprovedTitles.has(normalizeTitle(s.title)))
      .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);

    const scholarPts = (publications || [])
      .filter((s: any) => !crossTitles.has(normalizeTitle(s.title)) && !manualApprovedTitles.has(normalizeTitle(s.title)))
      .reduce((a: number, d: any) => a + calculateScholarPoints(d), 0);
    
    return {
      total: Math.round(scopusPts + scholarPts),
      scopus: Math.round(scopusPts),
      scholar: Math.round(scholarPts)
    };
  }, [profileData, approvedDocs]);

  const internalPoints = useMemo(() => {
    return Math.round(approvedDocs.reduce((acc, doc) => acc + (Number(doc.awarded_points) || 0), 0));
  }, [approvedDocs]);

  const grandTotal = apiPoints.total + internalPoints;

  // --- 2. 3 YEARS (2024-2026) CALCULATION ---
  const apiPoints3Years = useMemo(() => {
    if (!profileData) return { total: 0, scopus: 0, scholar: 0 };
    
    const publications = (profileData.publications || []).filter((p: any) => {
      const yr = Number(p.year);
      return yr >= currentYear - 2 && yr <= currentYear;
    });
    const scopusPublications = (profileData.scopusPublications || []).filter((s: any) => {
      const yr = Number(s.year);
      return yr >= currentYear - 2 && yr <= currentYear;
    });

    const manualApprovedTitles3Years = new Set(
      approvedDocs
        .filter((doc) => {
          const docYear = doc.published_at ? new Date(doc.published_at).getFullYear() : doc.tahun_pelaksanaan;
          const yr = Number(docYear);
          return yr >= currentYear - 2 && yr <= currentYear;
        })
        .map((d: any) => normalizeTitle(d.title))
        .filter(Boolean)
    );

    const crossTitles = new Set(
      (publications || []).filter((sd: any) => 
        (scopusPublications || []).some((s: any) => normalizeTitle(s.title) === normalizeTitle(sd.title))
      ).map((d: any) => normalizeTitle(d.title))
    );
    
    const scopusPts = (scopusPublications || [])
      .filter((s: any) => !manualApprovedTitles3Years.has(normalizeTitle(s.title)))
      .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);

    const scholarPts = (publications || [])
      .filter((s: any) => !crossTitles.has(normalizeTitle(s.title)) && !manualApprovedTitles3Years.has(normalizeTitle(s.title)))
      .reduce((a: number, d: any) => a + calculateScholarPoints(d), 0);
    
    return {
      total: Math.round(scopusPts + scholarPts),
      scopus: Math.round(scopusPts),
      scholar: Math.round(scholarPts)
    };
  }, [profileData, approvedDocs]);

  const internalPoints3Years = useMemo(() => {
    return Math.round(
      approvedDocs
        .filter((doc) => {
          const docYear = doc.published_at ? new Date(doc.published_at).getFullYear() : doc.tahun_pelaksanaan;
          const yr = Number(docYear);
          return yr >= currentYear - 2 && yr <= currentYear;
        })
        .reduce((acc, doc) => acc + (Number(doc.awarded_points) || 0), 0)
    );
  }, [approvedDocs]);

  const grandTotal3Years = apiPoints3Years.total + internalPoints3Years;

  // --- 3. THIS YEAR (2026) CALCULATION ---
  const apiPointsThisYear = useMemo(() => {
    if (!profileData) return { total: 0, scopus: 0, scholar: 0 };
    
    const publications = (profileData.publications || []).filter((p: any) => Number(p.year) === currentYear);
    const scopusPublications = (profileData.scopusPublications || []).filter((s: any) => Number(s.year) === currentYear);

    const manualApprovedTitlesThisYear = new Set(
      approvedDocs
        .filter((doc) => {
          const docYear = doc.published_at ? new Date(doc.published_at).getFullYear() : doc.tahun_pelaksanaan;
          return Number(docYear) === currentYear;
        })
        .map((d: any) => normalizeTitle(d.title))
        .filter(Boolean)
    );

    const crossTitles = new Set(
      (publications || []).filter((sd: any) => 
        (scopusPublications || []).some((s: any) => normalizeTitle(s.title) === normalizeTitle(sd.title))
      ).map((d: any) => normalizeTitle(d.title))
    );
    
    const scopusPts = (scopusPublications || [])
      .filter((s: any) => !manualApprovedTitlesThisYear.has(normalizeTitle(s.title)))
      .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);

    const scholarPts = (publications || [])
      .filter((s: any) => !crossTitles.has(normalizeTitle(s.title)) && !manualApprovedTitlesThisYear.has(normalizeTitle(s.title)))
      .reduce((a: number, d: any) => a + calculateScholarPoints(d), 0);
    
    return {
      total: Math.round(scopusPts + scholarPts),
      scopus: Math.round(scopusPts),
      scholar: Math.round(scholarPts)
    };
  }, [profileData, approvedDocs]);

  const internalPointsThisYear = useMemo(() => {
    return Math.round(
      approvedDocs
        .filter((doc) => {
          const docYear = doc.published_at ? new Date(doc.published_at).getFullYear() : doc.tahun_pelaksanaan;
          return Number(docYear) === currentYear;
        })
        .reduce((acc, doc) => acc + (Number(doc.awarded_points) || 0), 0)
    );
  }, [approvedDocs]);

  const grandTotalThisYear = apiPointsThisYear.total + internalPointsThisYear;

  const filteredDocs = useMemo(() => {
    const base = internalDocumentsOnly;
    if (categoryFilter === 'all') return base;
    return base.filter(doc => doc.category?.toLowerCase().includes(categoryFilter.toLowerCase()));
  }, [internalDocumentsOnly, categoryFilter]);

  const stats = useMemo(() => {
    return [
      { 
        label: 'Total Poin Dokumen Internal', 
        val: internalPoints, 
        icon: FileText, 
        color: 'text-amber-600', 
        bg: 'bg-amber-500/10' 
      },
      { 
        label: 'Total Poin Dokumen Eksternal (API)', 
        val: apiPoints.total, 
        icon: Globe, 
        color: 'text-blue-600', 
        bg: 'bg-blue-500/10' 
      },
      { 
        label: 'Total Kontribusi KPI', 
        val: internalPoints + apiPoints.total, 
        icon: TrendingUp, 
        color: 'text-primary-600', 
        bg: 'bg-primary-500/10' 
      },
    ];
  }, [apiPoints.total, internalPoints]);

  const scholarChartData = useMemo(() => {
    const publications = profileData?.publications || [];
    if (!publications || publications.length === 0) return { chartData: [], leftMax: 10, rightMax: 10 };
    const chartDataMap = new Map();
    publications.forEach((pub: any) => {
       if (pub.year && pub.year !== 'Unknown') {
         const yearKey = String(pub.year).trim();
         if (!chartDataMap.has(yearKey)) {
            chartDataMap.set(yearKey, { name: yearKey, publications: 0, citations: 0 });
         }
         const current = chartDataMap.get(yearKey);
         current.publications += 1;
         current.citations += (Number(pub.citations) || 0);
       }
    });
    const chartData = Array.from(chartDataMap.values()).sort((a: any, b: any) => parseInt(a.name) - parseInt(b.name));
    const getNiceMax = (max: number) => {
      if (!max || max <= 0) return 10;
      const roughMax = max * 1.15; 
      const magnitude = Math.pow(10, Math.floor(Math.log10(roughMax)));
      return Math.ceil(roughMax / magnitude) * magnitude;
    };
    return { 
      chartData, 
      leftMax: getNiceMax(Math.max(...chartData.map(d => d.publications), 0)), 
      rightMax: getNiceMax(Math.max(...chartData.map(d => d.citations), 0)) 
    };
  }, [profileData]);

  const scopusChartData = useMemo(() => {
    const scopusPublications = profileData?.scopusPublications || [];
    if (!scopusPublications || scopusPublications.length === 0) return { chartData: [], leftMax: 10, rightMax: 10 };
    const chartDataMap = new Map();
    scopusPublications.forEach((pub: any) => {
       if (pub.year && pub.year !== 'Unknown') {
         const yearKey = String(pub.year).trim();
         if (!chartDataMap.has(yearKey)) {
            chartDataMap.set(yearKey, { name: yearKey, publications: 0, citations: 0 });
         }
         const current = chartDataMap.get(yearKey);
         current.publications += 1;
         current.citations += (Number(pub.citations) || 0);
       }
    });
    const chartData = Array.from(chartDataMap.values()).sort((a: any, b: any) => parseInt(a.name) - parseInt(b.name));
    const getNiceMax = (max: number) => {
      if (!max || max <= 0) return 10;
      const roughMax = max * 1.15; 
      const magnitude = Math.pow(10, Math.floor(Math.log10(roughMax)));
      return Math.ceil(roughMax / magnitude) * magnitude;
    };
    return { 
      chartData, 
      leftMax: getNiceMax(Math.max(...chartData.map(d => d.publications), 0)), 
      rightMax: getNiceMax(Math.max(...chartData.map(d => d.citations), 0)) 
    };
  }, [profileData]);

  return {
    loading,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    categoryFilter,
    setCategoryFilter,
    activeView,
    setActiveView,
    publicationSubTab,
    setPublicationSubTab,
    profileData,
    fetchData,
    internalDocumentsOnly,
    approvedDocs,
    apiPoints,
    internalPoints,
    grandTotal,
    apiPoints3Years,
    internalPoints3Years,
    grandTotal3Years,
    apiPointsThisYear,
    internalPointsThisYear,
    grandTotalThisYear,
    filteredDocs,
    stats,
    scholarChartData,
    scopusChartData
  };
}
