import type { LucideIcon } from 'lucide-react';

// Session user admin
export interface AdminUser {
  id: number;
  role: string;
  name?: string;
}

// User dosen untuk dropdown selector
export interface LecturerUser {
  id: string;
  name: string;
  fakultas?: string;
  penta_id?: string;
  email?: string;
}

// Category weight dari API /api/weights
export interface CategoryWeight {
  id: number;
  category: string;
  weight_value: number;
}

// Opsi kategori utama
export interface MainCategoryOption {
  id: string;
  label: string;
  icon: LucideIcon;
}

// Opsi sub-kategori
export interface SubCategoryOption {
  id: string;
  label: string;
  pts: number;
  icon: LucideIcon;
}

// Preview estimasi poin KPI
export interface ScoringPreview {
  message: string;
  points: number;
}

// Status progress import excel
export interface ImportProgress {
  total: number;
  current: number;
}

// Detail error per baris saat import
export interface ImportErrorDetail {
  row: number;
  title: string;
  reason: string;
}

// Hasil akhir import excel
export interface ImportResult {
  success: number;
  failed: number;
  errors: ImportErrorDetail[];
}

// Props Sub-komponen

export interface InputDocumentHeaderProps {
  title?: string;
  subtitle?: string;
}

export interface InputTabSelectorProps {
  activeTab: 'manual' | 'import';
  onTabChange: (tab: 'manual' | 'import') => void;
}

export interface LecturerSelectorDropdownProps {
  users: LecturerUser[];
  selectedUserId: string;
  searchTerm: string;
  isDropdownOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement>;
  onSearchChange: (val: string) => void;
  onSelectUser: (id: string) => void;
  onToggleDropdown: () => void;
}

export interface CategorySelectorProps {
  mainCategories: MainCategoryOption[];
  mainCategory: string;
  subCategoryOptions: SubCategoryOption[];
  subCategory: string;
  onSelectMainCategory: (cat: string) => void;
  onSelectSubCategory: (sub: string) => void;
}

export interface ManualDocumentFormProps {
  users: LecturerUser[];
  selectedUserId: string;
  searchTerm: string;
  isDropdownOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement>;
  title: string;
  mainCategory: string;
  subCategoryOptions: SubCategoryOption[];
  subCategory: string;
  hkiType: string;
  inventorName: string;
  dateVal: Date | undefined;
  docType: 'kpi' | 'arsip';
  danaDisetujui: string;
  fokus: string;
  file: File | null;
  loading: boolean;
  message: string;
  messageType: 'success' | 'error';
  isDragging: boolean;
  scoringPreview: ScoringPreview;
  mainCategories: MainCategoryOption[];
  onSearchUserChange: (val: string) => void;
  onSelectUser: (id: string) => void;
  onToggleDropdown: () => void;
  onTitleChange: (val: string) => void;
  onSelectMainCategory: (cat: string) => void;
  onSelectSubCategory: (sub: string) => void;
  onHkiTypeChange: (val: string) => void;
  onInventorNameChange: (val: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onDocTypeChange: (type: 'kpi' | 'arsip') => void;
  onDanaDisetujuiChange: (val: string) => void;
  onFokusChange: (val: string) => void;
  onFileChange: (file: File | null) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export interface BatchExcelImportPanelProps {
  mainCategory: string;
  isImporting: boolean;
  importProgress: ImportProgress;
  importResult: ImportResult | null;
  message: string;
  messageType: 'success' | 'error';
  isDragging: boolean;
  onDownloadTemplate: () => void;
  onImportExcel: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDropFile: (file: File) => void;
}
