import { LucideIcon } from 'lucide-react';

// Representasi item grafik publikasi & sitasi
export interface ChartDataItem {
  name: string;
  publications: number;
  citations: number;
}

// Representasi hasil kalkulasi grafik
export interface ChartDataResult {
  chartData: ChartDataItem[];
  leftMax: number;
  rightMax: number;
}

// Detail profil dosen dari API
export interface LecturerProfileData {
  user: {
    id?: number | string;
    name?: string;
    email?: string;
    role?: string;
    avatar?: string;
    penta_id?: string;
    nidn?: string;
    program_studi?: string;
    fakultas?: string;
    scholar_id?: string;
    scopus_id?: string;
  } | null;
  scholarData?: {
    document_count?: number;
    total_citations: number;
    h_index: number;
    i10_index: number;
    thumbnail?: string;
    last_synced: string;
  } | null;
  scopusData?: {
    document_count: number;
    total_citations: number;
    h_index: number;
    last_synced: string;
  } | null;
  publications?: any[];
  scopusPublications?: any[];
}

// Struktur data kartu statistik KPI
export interface StatCard {
  label: string;
  val: string;
  icon: LucideIcon;
  color: string;
}

export interface ProfileCardProps {
  profile: LecturerProfileData;
  loading: boolean;
  stats: StatCard[];
  message?: string;
}

export interface ProfileViewSwitcherProps {
  activeView: 'external' | 'internal';
  onViewChange: (view: 'external' | 'internal') => void;
}

export interface ProfileNotFoundProps {
  onBack: () => void;
}
