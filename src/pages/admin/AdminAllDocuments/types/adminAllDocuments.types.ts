import type { LucideIcon } from 'lucide-react';

export type DocTab = 'publikasi' | 'hki' | 'penelitian' | 'buku';

export interface SessionUser {
  id: number;
  role: string;
  name?: string;
}

export interface AllDocumentItem {
  id: string;
  title?: string;
  category?: string;
  user_name?: string;
  fakultas?: string;
  published_at?: string;
  status: string;
  file_url?: string;
  source?: string;
  is_kpi_counted?: boolean;
  accreditation_period?: string;
  awarded_points?: number;
  catatan?: string;
  created_at?: string;
}

export interface AllResearchItem {
  id: string;
  judul_penelitian?: string;
  program?: string;
  skema?: string;
  fokus?: string;
  tahun?: string;
  status: string;
  dana_disetujui?: number;
  awarded_points?: number;
  catatan?: string;
  created_at?: string;
  user?: {
    name?: string;
    fakultas?: string;
  };
}

export interface PreviewDocState {
  fileUrl: string;
  title: string;
  category: string;
}

export interface HistoryModalState {
  isOpen: boolean;
  docId: number | null;
  title: string;
}

export interface TabDetailInfo {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
}

// Props Interfaces for Sub-components

export interface AllDocumentsHeaderProps {
  loading: boolean;
  hasData: boolean;
  onExportExcel: () => void;
}

export interface AllDocumentsSummaryCardsProps {
  activeTab: DocTab;
  totalCount: number;
  approvedCount: number;
  pendingCount: number;
  tabDetails: Record<DocTab, TabDetailInfo>;
}

export interface AllDocumentsTabsProps {
  activeTab: DocTab;
  tabDetails: Record<DocTab, TabDetailInfo>;
  onTabChange: (tab: DocTab) => void;
}

export interface AllDocumentsFilterBarProps {
  activeTab: DocTab;
  tabDetails: Record<DocTab, TabDetailInfo>;
  searchTerm: string;
  selectedFakultas: string;
  sortOrder: 'desc' | 'asc';
  userRole?: string;
  onSearchChange: (val: string) => void;
  onFakultasChange: (val: string) => void;
  onSortOrderChange: (val: 'desc' | 'asc') => void;
}

export interface AllDocumentsMobileListProps {
  items: any[];
  activeTab: DocTab;
  onPreview: (doc: PreviewDocState) => void;
  onHistory: (id: number, title: string) => void;
}

export interface AllDocumentsTableProps {
  items: any[];
  activeTab: DocTab;
  onPreview: (doc: PreviewDocState) => void;
  onHistory: (id: number, title: string) => void;
}

export interface AllDocumentsPaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
  onItemsPerPageChange: (val: number) => void;
}
