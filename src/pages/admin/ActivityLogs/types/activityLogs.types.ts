import { ReactNode } from 'react';

// Representasi detail user di dalam sebuah log aktivitas
export interface LogUser {
  id?: number;
  name?: string;
  role?: string;
}

// Representasi data log aktivitas tunggal
export interface ActivityLog {
  id: number | string;
  created_at: string;
  action: string;
  description: string;
  user: LogUser | null;
}

// Model data response dari endpoint log aktivitas admin
export interface ActivityLogsResponse {
  logs: ActivityLog[];
  total: number;
  last_page: number;
}

// Konfigurasi visual lencana dan ikon untuk setiap kategori aksi
export interface ActionConfig {
  badge: string;
  dot: string;
  icon: ReactNode;
  ring: string;
  iconBg: string;
}

// Interface user utama dari konteks aplikasi/session
export interface SessionUser {
  id?: number;
  name?: string;
  role?: string;
  scholar_id?: string;
  scopus_id?: string;
}

export interface ActivityLogsHeaderProps {
  totalItems: number;
  loading: boolean;
  onExportExcel: () => Promise<void>;
  exportDisabled: boolean;
}

export interface ActivityLogsStatsProps {
  loginCount: number;
  verifyCount: number;
  syncCount: number;
}

export interface ActivityLogsFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedAction: string;
  onActionChange: (value: string) => void;
  userRole?: string;
}

export interface ActivityLogsTableProps {
  logs: ActivityLog[];
  copiedId: number | string | null;
  onCopy: (text: string, id: number | string) => void;
}

export interface ActivityLogsMobileTimelineProps {
  logs: ActivityLog[];
  copiedId: number | string | null;
  onCopy: (text: string, id: number | string) => void;
}

export interface ActivityLogsEmptyProps {
  hasFilters: boolean;
}

export interface ActivityLogsPaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
  onItemsPerPageChange: (limit: number) => void;
}
