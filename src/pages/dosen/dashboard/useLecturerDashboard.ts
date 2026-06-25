import { useState, useEffect, useMemo } from 'react';
import { FileText, Globe, TrendingUp } from 'lucide-react';
import { 
  calculateScopusSintaPoints, 
  calculateScholarPoints, 
  normalizeTitle 
} from './pointsCalculator';

export default function useLecturerDashboard(user: any) {
  const [internalDocuments, setInternalDocuments] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState<string>('penelitian');
  const [activeView, setActiveView] = useState<'all' | 'internal' | 'external'>('all');
  const [publicationSubTab, setPublicationSubTab] = useState<'scopus' | 'scholar' | 'cross_indexed' | 'metriks'>('scopus');
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [docsRes, profileRes, annRes, penRes] = await Promise.all([
        fetch(`/api/users/${user.id}/documents`),
        fetch(`/api/users/${user.id}`),
        fetch('/api/dosen/announcements'),
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

      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfileData(data);
      }

      if (annRes.ok) {
        const data = await annRes.json();
        setAnnouncements(data.announcements || []);
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
    return internalDocuments.filter(doc => doc.file_url && doc.file_url !== '');
  }, [internalDocuments]);

  const approvedDocs = useMemo(() => {
    return internalDocumentsOnly.filter(doc => doc.status === 'Approved');
  }, [internalDocumentsOnly]);

  const apiPoints = useMemo(() => {
    if (!profileData) return { total: 0, scopus: 0, scholar: 0 };
    
    const { publications = [], scopusPublications = [] } = profileData;
    const crossTitles = new Set(
      (publications || []).filter((sd: any) => 
        (scopusPublications || []).some((s: any) => normalizeTitle(s.title) === normalizeTitle(sd.title))
      ).map((d: any) => normalizeTitle(d.title))
    );
    
    const scopusPts = (scopusPublications || []).reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);
    const scholarPts = parseFloat(
      (publications || [])
        .filter((s: any) => !crossTitles.has(normalizeTitle(s.title)))
        .reduce((a: number, d: any) => a + calculateScholarPoints(d), 0)
        .toFixed(1)
    );
    
    return {
      total: parseFloat((scopusPts + scholarPts).toFixed(1)),
      scopus: scopusPts,
      scholar: scholarPts
    };
  }, [profileData]);

  const internalPoints = useMemo(() => {
    return approvedDocs.reduce((acc, doc) => acc + (Number(doc.awarded_points) || 0), 0);
  }, [approvedDocs]);

  const grandTotal = parseFloat((apiPoints.total + internalPoints).toFixed(1));

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
    announcements,
    profileData,
    fetchData,
    internalDocumentsOnly,
    approvedDocs,
    apiPoints,
    internalPoints,
    grandTotal,
    filteredDocs,
    stats,
    scholarChartData,
    scopusChartData
  };
}
