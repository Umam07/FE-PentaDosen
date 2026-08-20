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
  is_corresponding?: boolean;
  is_corresponding_confirmed?: boolean;
  is_sinta_confirmed?: boolean;
  is_cross_indexed?: boolean;
  quartile?: string;
  awarded_points?: number;
  linked_research_id?: number;
  catatan?: string;
  sinta_rank?: string;
  citations?: number;
  is_accredited?: boolean;
  issn?: string;
  garuda_id?: string;
  is_kpi_counted?: boolean;
}

export interface InternationalPublicationDoc extends PublicationDoc {
  quartile?: string;
  scopus_id?: string;
  sjr?: number;
  subtype?: string;
}

export interface NationalPublicationDoc extends PublicationDoc {
  sinta_rank?: 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'Non-SINTA';
  is_accredited?: boolean;
  issn?: string;
  garuda_id?: string;
}

export type SintaFilterType = 'all' | 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6' | 'Non-SINTA';
export type ScopusFilterType = 'all' | 'unconfirmed' | 'confirmed';
export type ArticleFilterType = 'all' | 'article' | 'non-article';
export type QuartileFilterType = 'all' | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'None';
export type SourceFilterType = 'all' | 'external' | 'manual';


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
  citations?: number;
}
