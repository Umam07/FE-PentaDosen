import { Award, Globe, FileText, TrendingUp } from 'lucide-react';
import { calculateScholarPoints, calculateScopusSintaPoints } from '../../../dosen/dashboard/pointsCalculator';
import { LecturerProfileData, StatCard, ChartDataResult } from '../types/lecturerProfile.types';

/**
 * Menormalisasi string judul untuk membandingkan secara case-insensitive & membuang karakter non-alphanumeric
 */
export const normalizeTitle = (title: string): string => {
  return (title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
};

/**
 * Melakukan kalkulasi poin KPI gabungan antara Eksternal & Internal
 */
export function calculateKPIStats(
  profile: LecturerProfileData | null,
  internalDocuments: any[]
): StatCard[] {
  const publications = profile?.publications || [];
  const scopusPublications = profile?.scopusPublications || [];
  const currentYear = 2026; // Tahun KPI aktif saat ini

  // --- 1. OVERALL CALCULATION ---
  const crossTitles = new Set(
    (publications || []).filter(sd => 
      (scopusPublications || []).some(s => normalizeTitle(s.title) === normalizeTitle(sd.title))
    ).map(d => normalizeTitle(d.title))
  );

  const extCross = (scopusPublications || [])
    .filter(s => crossTitles.has(normalizeTitle(s.title)))
    .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);

  const extScopus = (scopusPublications || [])
    .filter(s => !crossTitles.has(normalizeTitle(s.title)))
    .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);

  const extScholar = (publications || [])
    .filter(s => !crossTitles.has(normalizeTitle(s.title)))
    .reduce((a: number, d: any) => a + calculateScholarPoints(d), 0);

  const extTotal = Math.round(extCross + extScopus + extScholar);

  const internalTotal = Math.round(
    (internalDocuments || [])
      .filter((d: any) => d.status === 'Approved' && d.file_url && d.file_url !== '')
      .reduce((acc: number, d: any) => acc + (Number(d.awarded_points) || 0), 0)
  );

  // --- 2. 3 YEARS (2024-2026) CALCULATION ---
  const publications3Years = (publications || []).filter(p => {
    const yr = Number(p.year);
    return yr >= currentYear - 2 && yr <= currentYear;
  });
  const scopus3Years = (scopusPublications || []).filter(s => {
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
    .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);

  const extScopus3Years = scopus3Years
    .filter(s => !crossTitles3Years.has(normalizeTitle(s.title)))
    .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);

  const extScholar3Years = publications3Years
    .filter(s => !crossTitles3Years.has(normalizeTitle(s.title)))
    .reduce((a: number, d: any) => a + calculateScholarPoints(d), 0);

  const api3Years = Math.round(extCross3Years + extScopus3Years + extScholar3Years);

  const internal3Years = Math.round(
    (internalDocuments || [])
      .filter((d: any) => {
        if (d.status !== 'Approved' || !d.file_url || d.file_url === '') return false;
        const yr = d.published_at ? new Date(d.published_at).getFullYear() : (d.tahun_pelaksanaan || d.tahun);
        return Number(yr) >= currentYear - 2 && Number(yr) <= currentYear;
      })
      .reduce((acc: number, d: any) => acc + (Number(d.awarded_points) || 0), 0)
  );

  // --- 3. THIS YEAR (2026) CALCULATION ---
  const publicationsThisYear = (publications || []).filter(p => Number(p.year) === currentYear);
  const scopusThisYear = (scopusPublications || []).filter(s => Number(s.year) === currentYear);

  const crossTitlesThisYear = new Set(
    publicationsThisYear
      .filter(sd => scopusThisYear.some(s => normalizeTitle(s.title) === normalizeTitle(sd.title)))
      .map(d => normalizeTitle(d.title))
  );

  const extCrossThisYear = scopusThisYear
    .filter(s => crossTitlesThisYear.has(normalizeTitle(s.title)))
    .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);

  const extScopusThisYear = scopusThisYear
    .filter(s => !crossTitlesThisYear.has(normalizeTitle(s.title)))
    .reduce((a: number, d: any) => a + calculateScopusSintaPoints(d), 0);

  const extScholarThisYear = publicationsThisYear
    .filter(s => !crossTitlesThisYear.has(normalizeTitle(s.title)))
    .reduce((a: number, d: any) => a + calculateScholarPoints(d), 0);

  const apiThisYear = Math.round(extCrossThisYear + extScopusThisYear + extScholarThisYear);

  const internalThisYear = Math.round(
    (internalDocuments || [])
      .filter((d: any) => d.status === 'Approved' && d.file_url && d.file_url !== '' && new Date(d.published_at).getFullYear() === currentYear)
      .reduce((acc: number, d: any) => acc + (Number(d.awarded_points) || 0), 0)
  );

  return [
    { 
      label: 'Total KPI Overall', 
      val: (extTotal + internalTotal).toLocaleString(), 
      icon: Award
    },
    { 
      label: 'Total KPI 3 Tahun',
      val: (api3Years + internal3Years).toLocaleString(),
      icon: TrendingUp
    },
    { 
      label: 'Total KPI Tahun Ini',
      val: (apiThisYear + internalThisYear).toLocaleString(),
      icon: Globe
    }
  ];
}

/**
 * Menghitung nilai maksimum yang manis (nice round number) untuk batas sumbu chart
 */
const getNiceMax = (max: number): number => {
  if (!max || max <= 0) return 10;
  const roughMax = max * 1.15; 
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughMax)));
  return Math.ceil(roughMax / magnitude) * magnitude;
};

/**
 * Memformat data publikasi & sitasi untuk Google Scholar/Scopus Chart
 */
export function formatChartData(publications: any[]): ChartDataResult {
  if (!publications || publications.length === 0) {
    return { chartData: [], leftMax: 10, rightMax: 10 };
  }

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

  const chartData = Array.from(chartDataMap.values())
    .sort((a: any, b: any) => parseInt(a.name) - parseInt(b.name));

  const leftMax = getNiceMax(Math.max(...chartData.map(d => d.publications), 0));
  const rightMax = getNiceMax(Math.max(...chartData.map(d => d.citations), 0));

  return { chartData, leftMax, rightMax };
}
