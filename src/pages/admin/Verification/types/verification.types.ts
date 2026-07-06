// Definisi tipe data untuk dokumen umum (publikasi, hki, buku)
export interface VerificationDocument {
  id: string;
  title: string;
  category: string;
  published_at?: string;
  created_at?: string;
  file_url?: string;
  user_name?: string;
  fakultas?: string;
  is_kpi_counted?: boolean;
  accreditation_period?: string;
  user?: {
    id?: number;
    name?: string;
    email?: string;
    program_studi?: string;
    fakultas?: string;
  };
}

// Definisi tipe data untuk penelitian
export interface VerificationResearch {
  id: string;
  judul_penelitian: string;
  program: string;
  skema: string;
  fokus: string;
  tahun: string;
  created_at: string;
  dana_disetujui: number;
  file_url?: string;
  user?: {
    id?: number;
    name?: string;
    email?: string;
    program_studi?: string;
    fakultas?: string;
  };
}

// Tipe Tab yang aktif di halaman verifikasi
export type VerificationTab = 'publikasi' | 'hki' | 'penelitian' | 'buku';

// Tipe item yang sedang ditolak
export interface RejectingItem {
  id: string;
  title: string;
  type: 'documents' | 'research';
}

// Tipe pratinjau dokumen PDF
export interface PreviewDoc {
  fileUrl: string;
  title: string;
  category: string;
}

// Tipe state modal riwayat dokumen
export interface HistoryModalState {
  isOpen: boolean;
  docId: number | null;
  title: string;
}

// Interface user utama dari konteks aplikasi/session
export interface SessionUser {
  id?: number;
  name?: string;
  role?: string;
}

// Properti untuk masing-masing sub-komponen UI
export interface VerificationHeaderProps {
  totalPending: number;
  loading: boolean;
}

export interface VerificationTabsProps {
  activeTab: VerificationTab;
  onTabChange: (tab: VerificationTab) => void;
}

export interface VerificationFilterProps {
  activeTab: VerificationTab;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedFakultas: string;
  onFakultasChange: (val: string) => void;
  sortOrder: 'desc' | 'asc';
  onSortOrderChange: (val: 'desc' | 'asc') => void;
  userRole?: string;
}

export interface VerificationTableProps {
  activeTab: VerificationTab;
  items: any[];
  actionLoading: string | null;
  userRole?: string;
  onVerify: (id: string, status: 'Approved') => Promise<void>;
  onRejectStart: (item: RejectingItem) => void;
  onPreview: (doc: PreviewDoc) => void;
  onHistory: (id: number, title: string) => void;
}

export interface VerificationMobileListProps {
  activeTab: VerificationTab;
  items: any[];
  actionLoading: string | null;
  userRole?: string;
  onVerify: (id: string, status: 'Approved') => Promise<void>;
  onRejectStart: (item: RejectingItem) => void;
  onPreview: (doc: PreviewDoc) => void;
}

export interface VerificationEmptyProps {
  activeTab: VerificationTab;
}

export interface VerificationPaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
  onItemsPerPageChange: (limit: number) => void;
}

export interface RejectConfirmationModalProps {
  rejectingItem: RejectingItem | null;
  onClose: () => void;
  feedbackText: string;
  onFeedbackChange: (text: string) => void;
  actionLoading: boolean;
  onConfirm: () => Promise<void>;
}
