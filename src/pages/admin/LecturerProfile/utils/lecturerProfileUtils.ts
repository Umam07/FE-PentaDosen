import { Award, Globe, FileText } from 'lucide-react';
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

  const grandTotal = extTotal + internalTotal;

  return [
    { 
      label: 'Total KPI', 
      val: grandTotal.toLocaleString(), 
      icon: Award, 
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
    },
    { 
      label: 'Poin (External)',
      val: extTotal.toLocaleString(),
      icon: Globe, 
      color: 'bg-primary-500/10 text-primary-600 dark:text-primary-400' 
    },
    { 
      label: 'Poin (Internal)',
      val: internalTotal.toLocaleString(),
      icon: FileText, 
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
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
