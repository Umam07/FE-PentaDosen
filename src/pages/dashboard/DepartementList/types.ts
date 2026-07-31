import React from 'react';

export interface DepartmentStats {
  fakultas: string;
  dosen_count: number;
  research_count?: number;
  publication_count?: number;
  document_count?: number;
  total_points: number;
}

export interface FakultasMeta {
  icon: React.ComponentType<any>;
  color: string;
  textColor: string;
  bgColor: string;
  badgeBg: string;
  glowColor: string;
  description: string;
  prodi: string[];
}

export interface DepartmentItem extends FakultasMeta {
  id: string;
  name: string;
  lecturerCount: number;
  researchCount?: number;
  publicationCount?: number;
  documentCount: number;
  totalKPI: number;
}
