export interface UserSession {
  id: string | number;
  role?: string;
  name?: string;
}

export interface BukuDoc {
  id: number;
  user_id?: number;
  title: string;
  category: string;
  published_at?: string;
  status: string;
  catatan?: string;
  file_url?: string;
  awarded_points?: number;
  is_kpi_counted?: boolean;
  linked_research_id?: number;
  source?: string;
}

export interface ApprovedResearch {
  id: number;
  judul_penelitian: string;
  program?: string;
  skema?: string;
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
  validCount: number;
}
