export interface UserSession {
  id: string | number;
  role?: string;
  name?: string;
}

export interface ResearchItem {
  id: number;
  user_id: number;
  judul_penelitian: string;
  dana_disetujui: number | string;
  program: string;
  skema?: string;
  fokus?: string;
  tahun: string | number;
  doc_type?: 'kpi' | 'arsip';
  file_url?: string;
  status: string;
  catatan?: string;
  awarded_points?: number;
  is_kpi_counted?: boolean;
}

export interface PreviewDocState {
  fileUrl: string;
  title: string;
  category: string;
}

export interface StatsInfo {
  total: number;
  approved: number;
  pending: number;
  points: number;
  totalDana: number;
}
