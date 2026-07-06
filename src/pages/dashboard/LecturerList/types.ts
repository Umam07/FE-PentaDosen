export interface LecturerItem {
  id: string | number;
  name: string;
  thumbnail?: string;
  penta_id?: string;
  fakultas?: string;
  program_studi?: string;
  total_citations?: number;
  h_index?: number;
  scopus_total_citations?: number;
  scopus_h_index?: number;
  total_kpi_points: number;
}

export interface FakultasTheme {
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  badgeClass: string;
  glowColor: string;
}
