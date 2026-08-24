import React from 'react';
import { ScholarDocument, ScopusDocument } from '../../dosen/dashboard/components/external-documents/external-documents.types';
import { InternalDocument } from '../../dosen/dashboard/components/internal-documents/internal-documents.types';

export interface LecturerUser {
  avatar?: string;
  thumbnail?: string;
  name: string;
  role: string;
  fakultas?: string;
  program_studi?: string;
  penta_id?: string;
  email?: string;
  nidn?: string;
  scholar_id?: string;
  scopus_id?: string;
}

export interface LecturerProfile {
  user: LecturerUser;
  scholarData?: any;
  scopusData?: any;
  publications: ScholarDocument[];
  scopusPublications: ScopusDocument[];
}

export interface DocumentsResponse {
  documents: InternalDocument[];
}

export interface StatItem {
  label: string;
  val: string;
  icon: React.ComponentType<any>;
  color: string;
}

export interface ChartDataItem {
  name: string;
  publications: number;
  citations: number;
}

export interface ChartDataResult {
  chartData: ChartDataItem[];
  leftMax: number;
  rightMax: number;
}
