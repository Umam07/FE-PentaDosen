// Interface detail profil dosen dalam database
export interface Lecturer {
  id: number | string;
  penta_id?: string;
  nidn?: string;
  name: string;
  email?: string;
  program_studi?: string;
  fakultas?: string;
  thumbnail?: string;
  total_kpi_points: number;
  poin_external?: number;
  poin_internal?: number;
  scholar_id?: string;
  scopus_id?: string;
  scholar_document_count?: number;
  total_citations?: number;
  h_index?: number;
  i10_index?: number;
  scopus_document_count?: number;
  scopus_total_citations?: number;
  scopus_h_index?: number;
}

// Interface user utama dari konteks aplikasi/session
export interface SessionUser {
  id?: number | string;
  name?: string;
  role?: string;
}

// Properti untuk sub-komponen UI
export interface LecturersHeaderProps {
  loading: boolean;
  exportDisabled: boolean;
  onExportExcel: () => Promise<void>;
}

export interface LecturersFilterProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedFakultas: string;
  onFakultasChange: (val: string) => void;
  loading: boolean;
  userRole?: string;
}

export interface LecturersTableProps {
  items: Lecturer[];
  onItemClick: (id: number | string) => void;
}

export interface LecturersEmptyProps {}

export interface LecturersPaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
  onItemsPerPageChange: (limit: number) => void;
}
