import React from 'react';

export interface ScholarDocument {
  id?: string | number;
  title: string;
  citations?: number;
  link?: string;
  year?: string | number;
  author?: string;
  [key: string]: any;
}

export interface ScopusDocument {
  id: string | number;
  title: string;
  citations?: number;
  link?: string;
  year?: string | number;
  journal?: string;
  source_name?: string;
  author_role?: string;
  total_authors?: string | number;
  author_order?: string | number;
  is_corresponding?: boolean;
  is_corresponding_confirmed?: boolean;
  is_hyperauthor?: boolean;
  quartile?: string | null;
  subtype?: string;
  subtype_description?: string;
  [key: string]: any;
}

export interface ScopusBreakdown {
  basePoints: number;
  totalPoints: number;
  maxPoints: number;
  detailStr: string;
  pctStr: string;
  totalAuthors: number;
  authorOrder: number;
  citations: number;
  isArticle: boolean;
  isHyper: boolean;
  role: string;
  q: string;
  isCorresponding: boolean;
  isCorrespondingConfirmed: boolean;
}

export interface ScholarDocRowProps {
  doc: ScholarDocument;
  docPoints: number;
  isAlsoScopus: boolean;
  scopusQuartile?: string | null;
  idx: number;
  normalizeTitle?: (t: string) => string;
  key?: React.Key;
}

export interface ScopusDocRowProps {
  doc: ScopusDocument;
  isAlsoScholar: boolean;
  idx: number;
  onRefresh?: () => void;
  isPublic?: boolean;
  key?: React.Key;
}

export interface CrossIndexedDocRowProps {
  doc: ScholarDocument;
  scopusDoc: ScopusDocument | undefined;
  idx: number;
  key?: React.Key;
}

export interface PaginationProps {
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (limit: number) => void;
}

export interface ExternalDocumentsViewProps {
  publicationSubTab: 'scopus' | 'scholar' | 'cross_indexed' | 'metriks';
  setPublicationSubTab: (tab: 'scopus' | 'scholar' | 'cross_indexed' | 'metriks') => void;
  scopusChartData: any;
  scholarChartData: any;
  scopusData: any;
  scholarData: any;
  publications: ScholarDocument[];
  scopusPublications: ScopusDocument[];
  tabVariants: any;
  onRefresh?: () => void;
  loading?: boolean;
  isPublic?: boolean;
}
