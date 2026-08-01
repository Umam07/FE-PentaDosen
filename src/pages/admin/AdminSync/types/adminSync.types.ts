// Tipe user dari outlet context (session)
export interface SessionUser {
  id: number;
  role: string;
  name?: string;
}

// Data dosen dari API /api/admin/lecturers
export interface Lecturer {
  id: string;
  name: string;
  email?: string;
  scholar_id?: string;
  scopus_id?: string;
  fakultas?: string;
  program_studi?: string;
  thumbnail?: string;
}

// Snapshot data Google Scholar
export interface ScholarData {
  total_citations: number;
  h_index: number;
  i10_index: number;
  thumbnail?: string;
}

// Snapshot data Scopus
export interface ScopusData {
  document_count: number;
  total_citations: number;
  h_index: number;
}

// Data profil dosen lengkap dari API /api/users/:id
export interface LecturerProfile {
  user: LecturerUser;
  scholarData: ScholarData | null;
  scopusData: ScopusData | null;
}

// Data user detail dari profil API
export interface LecturerUser {
  name: string;
  email: string;
  scholar_id?: string;
  scopus_id?: string;
  program_studi?: string;
  fakultas?: string;
}

// Hasil cek author dari Scholar/Scopus check API
export interface CheckedAuthor {
  name: string;
  affiliations: string;
  thumbnail?: string;
}

// State sync queue engine
export type SyncState = 'idle' | 'running' | 'paused' | 'cancelled' | 'completed';

export interface SyncLog {
  time: string;
  type: 'info' | 'success' | 'error' | 'warning';
  msg: string;
}

export interface SyncStats {
  total: number;
  processed: number;
  success: number;
  failed: number;
  skipped: number;
}

// ============================
// Props sub-komponen
// ============================

export interface SyncHeaderProps {
  syncState: SyncState;
  progressPercent: number;
  onStartMassSync: () => void;
  onScrollToConsole: () => void;
}

export interface SyncSummaryCardsProps {
  totalLecturers: number;
  scholarConnected: number;
  scopusConnected: number;
}

export interface SyncConsoleProps {
  syncState: SyncState;
  syncStats: SyncStats;
  syncLogs: SyncLog[];
  progressPercent: number;
  etaSeconds: number;
  copied: boolean;
  terminalEndRef: React.RefObject<HTMLDivElement>;
  onStart: () => void;
  onPause: () => void;
  onCancel: () => void;
  onClose: () => void;
  onCopyLogs: () => void;
}

export interface LecturerManagementPanelProps {
  scholarUser: LecturerUser;
  scholarData: ScholarData | null;
  scopusData: ScopusData | null;
  scholarId: string;
  scopusId: string;
  loadingScholar: boolean;
  loadingScopus: boolean;
  checkingInfoScholar: boolean;
  checkingInfoScopus: boolean;
  checkedAuthorScholar: CheckedAuthor | null;
  checkedAuthorScopus: CheckedAuthor | null;
  messageScholar: string;
  messageScopus: string;
  onScholarIdChange: (val: string) => void;
  onScopusIdChange: (val: string) => void;
  onCheckScholar: () => void;
  onSaveScholar: () => void;
  onSyncScholar: () => void;
  onCheckScopus: () => void;
  onSaveScopus: () => void;
  onSyncScopus: () => void;
  onClose: () => void;
  onClearCheckedScholar: () => void;
  onClearCheckedScopus: () => void;
}

export interface ScholarIntegrationCardProps {
  scholarId: string;
  scholarData: ScholarData | null;
  scholarUser: LecturerUser;
  loadingScholar: boolean;
  checkingInfoScholar: boolean;
  checkedAuthorScholar: CheckedAuthor | null;
  messageScholar: string;
  onScholarIdChange: (val: string) => void;
  onCheck: () => void;
  onSave: () => void;
  onSync: () => void;
  onClearChecked: () => void;
}

export interface ScopusIntegrationCardProps {
  scopusId: string;
  scopusData: ScopusData | null;
  scholarUser: LecturerUser;
  loadingScopus: boolean;
  checkingInfoScopus: boolean;
  checkedAuthorScopus: CheckedAuthor | null;
  messageScopus: string;
  onScopusIdChange: (val: string) => void;
  onCheck: () => void;
  onSave: () => void;
  onSync: () => void;
  onClearChecked: () => void;
}

export interface SyncTrackerTableProps {
  lecturers: Lecturer[];
  currentLecturers: Lecturer[];
  filteredCount: number;
  selectedLecturerId: string;
  currentSyncingId: string | null;
  searchTerm: string;
  selectedFakultas: string;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
  userRole?: string;
  onSearchChange: (val: string) => void;
  onFakultasChange: (val: string) => void;
  onSelectLecturer: (id: string) => void;
  onPageChange: (page: number | ((prev: number) => number)) => void;
  onItemsPerPageChange: (val: number) => void;
}
