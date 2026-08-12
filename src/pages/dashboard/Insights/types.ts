export interface TopPerformer {
  id?: string | number;
  name: string;
  total_kpi_points: number;
  program_studi?: string;
  thumbnail?: string;
  scopus_count?: number;
  citations_count?: number;
}

export interface DashboardStats {
  total_docs: number;
  total_research: number;
  total_scholar: number;
  total_scopus: number;
  total_citations: number;
  total_points: number;
  total_dosen: number;
  kpi_score_3_years: number;
  kpi_score_this_year: number;
  top_performer?: TopPerformer;
  approved_docs?: number;
  data_accuracy?: number;
}

export interface LeaderboardUser {
  id: string | number;
  name: string;
  thumbnail?: string;
  program_studi: string;
  total_kpi_points: number;
  faculty_name?: string;
  rank_change?: number;
}

export interface FakultasRawItem {
  fakultas: string;
  total_points: number;
  dosen_count: number;
}

export interface FakultasFormattedItem extends FakultasRawItem {
  name: string;
  fullName: string;
  value: number;
  dosen: number;
  color: string;
}
