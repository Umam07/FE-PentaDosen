export interface UserSession {
  id: number;
  role?: string;
  name?: string;
}

export interface PublicationDoc {
  id: number;
  title: string;
  category: string;
  published_at?: string;
  status: string;
  file_url?: string;
  source?: string;
  subtype?: string;
  total_authors?: number;
  author_role?: string;
  is_corresponding_confirmed?: boolean;
  is_cross_indexed?: boolean;
  quartile?: string;
  awarded_points?: number;
  linked_research_id?: number;
  catatan?: string;
}

export interface ApprovedResearch {
  id: number;
  judul_penelitian: string;
  program?: string;
  skema?: string;
}

export interface WeightCategory {
  id?: number;
  category: string;
  weight_value?: number;
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
}
