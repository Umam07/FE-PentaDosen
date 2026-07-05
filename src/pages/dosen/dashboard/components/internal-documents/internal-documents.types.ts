import React from 'react';

// ─── Tab ──────────────────────────────────────────────────────────────────────

export type MainTab = 'dokumen' | 'metriks';

// ─── Data models ──────────────────────────────────────────────────────────────

/** Penelitian yang tertaut ke dokumen HKI / Buku / Jurnal */
export interface LinkedPenelitian {
  judul_penelitian: string;
  program: string;
  tahun: string | number;
}

/**
 * Model data dokumen internal (penelitian, HKI, buku, jurnal).
 * Field diambil dari akses JSX di seluruh sub-komponen.
 */
export interface InternalDocument {
  id: number;
  id_dokumen?: string;
  title: string;
  category: string;
  status: string;
  file_url?: string | null;
  awarded_points?: number | string | null;
  catatan?: string | null;
  is_kpi_counted?: boolean;
  published_at?: string | null;

  // Penelitian-specific
  tahun_pelaksanaan?: string | number;
  program?: string;
  skema?: string;
  fokus?: string;
  dana_disetujui?: number;

  // Jurnal / Scopus metadata
  quartile?: string | null;
  author_role?: string | null;
  is_corresponding?: boolean;
  is_corresponding_confirmed?: boolean;
  is_hyperauthor?: boolean;

  // Relasi ke penelitian asal (HKI & Buku)
  penelitian?: LinkedPenelitian | null;
}

// ─── Shared props ─────────────────────────────────────────────────────────────

/** Preview PDF yang dibuka lewat modal */
export interface DocPreview {
  fileUrl: string;
  title: string;
  category: string;
}

/**
 * Props dasar yang dimiliki semua komponen tabel / list dokumen internal.
 * Ekstrak ke sini supaya tidak didefinisikan ulang di tiap sub-komponen.
 */
export interface DocTableBaseProps {
  filteredDocs: InternalDocument[];
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
  setSelectedDocForDetail: (doc: InternalDocument) => void;
  setPreviewDoc: (preview: DocPreview | null) => void;
  isPublic?: boolean;
}

// ─── Kategori ─────────────────────────────────────────────────────────────────

export interface DocCategory {
  id: string;
  label: string;
  icon: React.ElementType;
}

// ─── Props komponen utama ─────────────────────────────────────────────────────

export interface InternalDocumentsViewProps {
  filteredDocs: InternalDocument[];
  allInternalDocs?: InternalDocument[];
  loading: boolean;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (limit: number) => void;
  categoryFilter: string;
  setCategoryFilter: (filter: string) => void;
  isPublic?: boolean;
}
