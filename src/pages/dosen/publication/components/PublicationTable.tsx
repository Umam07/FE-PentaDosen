import React, { useState, useMemo } from 'react';
import { 
  FileText, Upload, CheckCircle, XCircle, Clock, 
  Info, ChevronLeft, ChevronRight, Pencil, Trash2, Lock, RefreshCw, Calculator, RotateCcw
} from 'lucide-react';
import YearFilterBar from '../../../../components/ui/YearFilterBar';
import FilterDropdown, { FilterOption } from './FilterDropdown';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import { calculateScholarPoints } from '../../dashboard/pointsCalculator';
import PointBreakdownBox from './PointBreakdownBox';
import type { 
  ScopusFilterType, ArticleFilterType, QuartileFilterType, 
  SourceFilterType, SintaFilterType 
} from '../types/publication.types';

interface PublicationTableProps {
  isTableLoading: boolean;
  documents?: any[];
  urlKategori?: string;
  currentDocuments: any[];
  filteredDocuments: any[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: (val: number) => void;
  setSelectedDocForDetail: (doc: any) => void;
  setPreviewDoc: (doc: { fileUrl: string; title: string; category: string } | null) => void;
  uploadingPdfId: number | null;
  handleUploadPdf: (e: React.ChangeEvent<HTMLInputElement>, id: number) => Promise<void>;
  openEditModal: (doc: any) => void;
  setDeleteDoc: (doc: any) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  availableYears: number[];
  filterYear: number | null;
  onYearChange: (year: number | null) => void;
  handleToggleCorresponding?: (docId: string | number, isCorresponding: boolean) => Promise<void>;
  crossTitlesSet?: Set<string>;
  // Filter Props Terpadu
  scopusFilter?: ScopusFilterType;
  setScopusFilter?: (val: ScopusFilterType) => void;
  articleFilter?: ArticleFilterType;
  setArticleFilter?: (val: ArticleFilterType) => void;
  quartileFilter?: QuartileFilterType;
  setQuartileFilter?: (val: QuartileFilterType) => void;
  sintaFilter?: SintaFilterType;
  setSintaFilter?: (val: SintaFilterType) => void;
  sourceFilter?: SourceFilterType;
  setSourceFilter?: (val: SourceFilterType) => void;
  crossIndexedOnly?: boolean;
  setCrossIndexedOnly?: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export default function PublicationTable({
  isTableLoading,
  documents = [],
  urlKategori = '',
  currentDocuments,
  filteredDocuments,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  setSelectedDocForDetail,
  setPreviewDoc,
  uploadingPdfId,
  handleUploadPdf,
  openEditModal,
  setDeleteDoc,
  setIsDeleteModalOpen,
  availableYears,
  filterYear,
  onYearChange,
  handleToggleCorresponding,
  crossTitlesSet,
  scopusFilter = 'all',
  setScopusFilter,
  articleFilter = 'all',
  setArticleFilter,
  quartileFilter = 'all',
  setQuartileFilter,
  sintaFilter = 'all',
  setSintaFilter,
  sourceFilter = 'all',
  setSourceFilter,
  crossIndexedOnly = false,
  setCrossIndexedOnly,
}: PublicationTableProps) {
  const isDocLocked = (doc: any) =>
    doc.status === 'Verified by Fakultas' || doc.status === 'Approved';

  const [expandedPoints, setExpandedPoints] = useState<Record<string | number, boolean>>({});
  const [updatingCorrespondingId, setUpdatingCorrespondingId] = useState<string | number | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const isJI = (urlKategori || '').toLowerCase().includes('jurnal internasional');
  const isJN = (urlKategori || '').toLowerCase().includes('jurnal nasional');

  // Dokumen relevan untuk kategori ini
  const targetDocs = useMemo(() => {
    if (!documents || documents.length === 0) return [];
    if (urlKategori) {
      const targetCat = urlKategori.toLowerCase();
      return documents.filter((d: any) => {
        const cat = String(d.category || '').toLowerCase();
        return cat === targetCat || cat.includes(targetCat) || targetCat.includes(cat);
      });
    }
    return documents;
  }, [documents, urlKategori]);

  // Penghitungan Status Korespondensi (JI)
  const correspondenceCounts = useMemo(() => {
    const total = targetDocs.length;
    let unconfirmed = 0;
    let confirmed = 0;

    targetDocs.forEach((d: any) => {
      if (!d) return;
      if (d.source === 'scopus') {
        const subtypeStr = String(d.subtype || '').toLowerCase();
        const isArticle = !d.subtype || subtypeStr === 'ar' || subtypeStr === 'article';
        const totalAuthors = Number(d.total_authors) || 1;

        if (isArticle && totalAuthors > 1 && !d.is_corresponding_confirmed) {
          unconfirmed++;
        } else {
          confirmed++;
        }
      } else {
        confirmed++;
      }
    });

    return { total, unconfirmed, confirmed };
  }, [targetDocs]);

  // Penghitungan Tipe Artikel (JI)
  const typeCounts = useMemo(() => {
    const total = targetDocs.length;
    let article = 0;
    let nonArticle = 0;

    targetDocs.forEach((d: any) => {
      if (!d) return;
      if (d.source === 'scopus') {
        const subtypeStr = String(d.subtype || '').toLowerCase();
        const isArt = !d.subtype || subtypeStr === 'ar' || subtypeStr === 'article';
        if (isArt) article++;
        else nonArticle++;
      } else {
        article++;
      }
    });

    return { total, article, nonArticle };
  }, [targetDocs]);

  // Penghitungan Quartile (JI)
  const quartileCounts = useMemo(() => {
    const total = targetDocs.length;
    let q1 = 0, q2 = 0, q3 = 0, q4 = 0, none = 0;

    targetDocs.forEach((d: any) => {
      if (!d) return;
      const q = String(d.quartile || '').toUpperCase();
      if (q === 'Q1') q1++;
      else if (q === 'Q2') q2++;
      else if (q === 'Q3') q3++;
      else if (q === 'Q4') q4++;
      else none++;
    });

    return { total, Q1: q1, Q2: q2, Q3: q3, Q4: q4, None: none };
  }, [targetDocs]);

  // Penghitungan Status Konfirmasi SINTA (JN)
  const sintaConfirmationCounts = useMemo(() => {
    const total = targetDocs.length;
    let unconfirmed = 0;
    let confirmed = 0;

    targetDocs.forEach((d: any) => {
      if (!d) return;
      if (!d.is_sinta_confirmed) unconfirmed++;
      else confirmed++;
    });

    return { total, unconfirmed, confirmed };
  }, [targetDocs]);

  // Penghitungan SINTA Rank (JN)
  const sintaCounts = useMemo(() => {
    const total = targetDocs.length;
    let s1 = 0, s2 = 0, s3 = 0, s4 = 0, s5 = 0, s6 = 0, nonSinta = 0;

    targetDocs.forEach((d: any) => {
      if (!d) return;
      const rank = String(d.sinta_rank || 'Non-SINTA').toUpperCase();
      if (rank === 'S1') s1++;
      else if (rank === 'S2') s2++;
      else if (rank === 'S3') s3++;
      else if (rank === 'S4') s4++;
      else if (rank === 'S5') s5++;
      else if (rank === 'S6') s6++;
      else nonSinta++;
    });

    return { total, S1: s1, S2: s2, S3: s3, S4: s4, S5: s5, S6: s6, NonSinta: nonSinta };
  }, [targetDocs]);

  // Penghitungan Sumber Data (JI / JN / Umum)
  const sourceCounts = useMemo(() => {
    const total = targetDocs.length;
    let external = 0;
    let manual = 0;

    targetDocs.forEach((d: any) => {
      if (!d) return;
      if (['scopus', 'scholar', 'sinta', 'garuda'].includes(String(d.source || ''))) {
        external++;
      } else {
        manual++;
      }
    });

    return { total, external, manual };
  }, [targetDocs]);

  // Opsi Dropdown
  const jiStatusOptions: FilterOption[] = useMemo(() => [
    { id: 'all', label: 'Semua Status', count: correspondenceCounts.total },
    { id: 'unconfirmed', label: 'Perlu Konfirmasi', count: correspondenceCounts.unconfirmed },
    { id: 'confirmed', label: 'Terkonfirmasi', count: correspondenceCounts.confirmed },
  ], [correspondenceCounts]);

  const articleOptions: FilterOption[] = useMemo(() => [
    { id: 'all', label: 'Semua Tipe', count: typeCounts.total },
    { id: 'article', label: 'Article / Journal', count: typeCounts.article },
    { id: 'non-article', label: 'Non-Article', count: typeCounts.nonArticle },
  ], [typeCounts]);

  const quartileOptions: FilterOption[] = useMemo(() => [
    { id: 'all', label: 'Semua Quartile', count: quartileCounts.total },
    { id: 'Q1', label: 'Q1', count: quartileCounts.Q1 },
    { id: 'Q2', label: 'Q2', count: quartileCounts.Q2 },
    { id: 'Q3', label: 'Q3', count: quartileCounts.Q3 },
    { id: 'Q4', label: 'Q4', count: quartileCounts.Q4 },
    { id: 'None', label: 'Non-Q', count: quartileCounts.None },
  ], [quartileCounts]);

  const jnStatusOptions: FilterOption[] = useMemo(() => [
    { id: 'all', label: 'Semua Status', count: sintaConfirmationCounts.total },
    { id: 'unconfirmed', label: 'Perlu Konfirmasi SINTA', count: sintaConfirmationCounts.unconfirmed },
    { id: 'confirmed', label: 'Terkonfirmasi SINTA', count: sintaConfirmationCounts.confirmed },
  ], [sintaConfirmationCounts]);

  const sintaOptions: FilterOption[] = useMemo(() => [
    { id: 'all', label: 'Semua Akreditasi', count: sintaCounts.total },
    { id: 'S1', label: 'SINTA 1 (S1)', count: sintaCounts.S1 },
    { id: 'S2', label: 'SINTA 2 (S2)', count: sintaCounts.S2 },
    { id: 'S3', label: 'SINTA 3 (S3)', count: sintaCounts.S3 },
    { id: 'S4', label: 'SINTA 4 (S4)', count: sintaCounts.S4 },
    { id: 'S5', label: 'SINTA 5 (S5)', count: sintaCounts.S5 },
    { id: 'S6', label: 'SINTA 6 (S6)', count: sintaCounts.S6 },
    { id: 'Non-SINTA', label: 'Non-SINTA', count: sintaCounts.NonSinta },
  ], [sintaCounts]);

  const sourceOptions: FilterOption[] = useMemo(() => [
    { id: 'all', label: 'Semua Sumber', count: sourceCounts.total },
    { id: 'external', label: 'External API', count: sourceCounts.external },
    { id: 'manual', label: 'Input Manual', count: sourceCounts.manual },
  ], [sourceCounts]);

  // Total Filter Aktif
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterYear !== null) count++;
    if (isJI) {
      if (scopusFilter && scopusFilter !== 'all') count++;
      if (articleFilter && articleFilter !== 'all') count++;
      if (quartileFilter && quartileFilter !== 'all') count++;
    }
    if (isJN) {
      if (scopusFilter && scopusFilter !== 'all') count++;
      if (sintaFilter && sintaFilter !== 'all') count++;
    }
    if (sourceFilter && sourceFilter !== 'all') count++;
    if (crossIndexedOnly) count++;
    return count;
  }, [filterYear, isJI, isJN, scopusFilter, articleFilter, quartileFilter, sintaFilter, sourceFilter, crossIndexedOnly]);

  const handleResetAllFilters = () => {
    onYearChange(null);
    if (setScopusFilter) setScopusFilter('all');
    if (setArticleFilter) setArticleFilter('all');
    if (setQuartileFilter) setQuartileFilter('all');
    if (setSintaFilter) setSintaFilter('all');
    if (setSourceFilter) setSourceFilter('all');
    if (setCrossIndexedOnly) setCrossIndexedOnly(false);
    setCurrentPage(1);
  };

  const getBreakdown = (doc: any) => {
    const isJI = doc.category === 'Jurnal Internasional';
    const isJN = doc.category === 'Jurnal Nasional';
    if (!isJI && !isJN) return null;

    if (doc.source === 'scholar' || (isJN && !doc.sinta_rank && Number(doc.citations || 0) > 0)) {
      const citations = Number(doc.citations) || 0;
      const docPoints = 0.5;
      const citationBonus = citations > 0 ? 0.5 : 0;
      const citationPoints = Math.min(citations, 500) * 0.25;
      const totalPoints = calculateScholarPoints(doc);

      return {
        type: 'scholar',
        citations,
        docPoints,
        citationBonus,
        citationPoints,
        totalPoints,
      };
    }

    const role = doc.author_role === 'Member Author' || doc.author_role === 'Co-Author' 
      ? 'Member Author' 
      : (doc.author_role || 'Member Author');
    const totalAuthors = Number(doc.total_authors) || 1;
    const authorOrder = Number(doc.author_order) || (role === 'First Author' || role === 'Single Author' ? 1 : 2);
    const isCorresponding = !!doc.is_corresponding;
    
    let q = 'None';
    let basePoints = 10;
    let docType = 'Jurnal Nasional';

    if (isJI) {
      q = doc.quartile && ['Q1', 'Q2', 'Q3', 'Q4'].includes(doc.quartile) ? doc.quartile : 'None';
      const basePointsMap: Record<string, number> = { Q1: 40, Q2: 38, Q3: 35, Q4: 33, None: 33 };
      basePoints = basePointsMap[q] ?? 33;
      docType = `Jurnal Internasional ${q !== 'None' ? q : '(Tanpa Quartile)'}`;
    } else if (isJN) {
      const sRank = String(doc.sinta_rank || 'Non-SINTA').toUpperCase();
      const sintaPointsMap: Record<string, number> = {
        S1: 25,
        S2: 25,
        S3: 20,
        S4: 20,
        S5: 15,
        S6: 15,
        'NON-SINTA': 10
      };
      basePoints = sintaPointsMap[sRank] ?? 10;
      docType = `Jurnal Nasional (${sRank === 'NON-SINTA' ? 'Non-SINTA' : sRank})`;
    }

    let awardedPoints = 0;
    let detailStr = '';
    let pctStr = '';

    if (totalAuthors === 1 || (authorOrder === 1 && totalAuthors === 1)) {
      awardedPoints = basePoints;
      detailStr = `${docType} (Single Author)`;
      pctStr = `100% dari ${basePoints} pts`;
    } else if (totalAuthors === 2) {
      if (authorOrder === 1) {
        if (isCorresponding) {
          awardedPoints = 0.6 * basePoints;
          detailStr = `${docType} (First & Corresponding Author)`;
          pctStr = `Skenario 1: 60% dari ${basePoints} pts`;
        } else {
          awardedPoints = 0.5 * basePoints;
          detailStr = `${docType} (First Author)`;
          pctStr = `Skenario 2: 50% dari ${basePoints} pts`;
        }
      } else {
        if (isCorresponding) {
          awardedPoints = 0.5 * basePoints;
          detailStr = `${docType} (2nd Author + Corresponding)`;
          pctStr = `Skenario 2: 50% dari ${basePoints} pts`;
        } else {
          awardedPoints = 0.4 * basePoints;
          detailStr = `${docType} (2nd Author)`;
          pctStr = `Skenario 1: 40% dari ${basePoints} pts`;
        }
      }
    } else {
      if (authorOrder === 1) {
        if (isCorresponding) {
          awardedPoints = 0.6 * basePoints;
          detailStr = `${docType} (First & Corresponding Author)`;
          pctStr = `Skenario 1: 60% dari ${basePoints} pts`;
        } else {
          awardedPoints = 0.4 * basePoints;
          detailStr = `${docType} (First Author)`;
          pctStr = `Skenario 2: 40% dari ${basePoints} pts`;
        }
      } else {
        if (isCorresponding) {
          awardedPoints = 0.4 * basePoints;
          detailStr = `${docType} (Member Author + Corresponding)`;
          pctStr = `Skenario 2: 40% dari ${basePoints} pts`;
        } else {
          awardedPoints = (0.4 * basePoints) / (totalAuthors - 1);
          detailStr = `${docType} (Member Author)`;
          pctStr = `Skenario 1 (Default): 40% dari ${basePoints} pts ÷ ${totalAuthors - 1} anggota`;
        }
      }
    }

    const finalPoints = Math.round(awardedPoints);

    return {
      type: 'scopus',
      q,
      maxPoints: basePoints,
      detailStr,
      pctStr,
      totalAuthors,
      authorOrder,
      role,
      isCorresponding,
      isCorrespondingConfirmed: !!doc.is_corresponding_confirmed,
      totalPoints: finalPoints
    };
  };
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  return (
    <section className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-hairline-light dark:border-hairline-dark overflow-hidden shadow-2xs">
      {/* Header Tabel: Judul, Jumlah Dokumen, dan Counter Filter Aktif */}
      <div className="p-4 sm:p-5 border-b border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 className="text-sm sm:text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">
            Riwayat Publikasi
          </h3>
          <span className="px-2 py-0.5 text-[11px] font-semibold font-mono rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark">
            {filteredDocuments.length} Dokumen
          </span>
          {activeFiltersCount > 0 && (
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-ink text-on-ink dark:bg-on-dark dark:text-ink">
              {activeFiltersCount} Filter Aktif
            </span>
          )}
        </div>

        {/* Tombol Reset Filter di Ujung Kanan Header */}
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleResetAllFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark transition-colors underline-offset-4 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        )}
      </div>

      {/* Unified Filter Toolbar Terpadu */}
      <div className="px-3.5 sm:px-5 py-3 border-b border-hairline-light-soft dark:border-hairline-dark-soft bg-surface-light-raised/40 dark:bg-surface-dark-elevated/30 flex flex-wrap items-center gap-2">
        {/* 1. Filter Tahun */}
        <YearFilterBar
          availableYears={availableYears}
          selectedYear={filterYear}
          onYearChange={(y) => {
            onYearChange(y);
            setCurrentPage(1);
          }}
          variant="inline"
        />

        {/* 2. Filter Khusus Jurnal Internasional: Tahun -> Status -> Sumber -> Tipe -> Quartile */}
        {isJI && (
          <>
            <FilterDropdown
              categoryLabel="Status"
              options={jiStatusOptions}
              activeValue={scopusFilter}
              isOpen={openDropdownId === 'ji-status'}
              onOpenChange={(open) => setOpenDropdownId(open ? 'ji-status' : null)}
              onSelectOption={(val) => {
                setScopusFilter?.(val as ScopusFilterType);
                setCurrentPage(1);
              }}
            />
            <FilterDropdown
              categoryLabel="Sumber"
              options={sourceOptions}
              activeValue={sourceFilter}
              isOpen={openDropdownId === 'source'}
              onOpenChange={(open) => setOpenDropdownId(open ? 'source' : null)}
              onSelectOption={(val) => {
                setSourceFilter?.(val as SourceFilterType);
                setCurrentPage(1);
              }}
            />
            <FilterDropdown
              categoryLabel="Tipe"
              options={articleOptions}
              activeValue={articleFilter}
              isOpen={openDropdownId === 'ji-article'}
              onOpenChange={(open) => setOpenDropdownId(open ? 'ji-article' : null)}
              onSelectOption={(val) => {
                setArticleFilter?.(val as ArticleFilterType);
                setCurrentPage(1);
              }}
            />
            <FilterDropdown
              categoryLabel="Quartile"
              options={quartileOptions}
              activeValue={quartileFilter}
              isOpen={openDropdownId === 'ji-quartile'}
              onOpenChange={(open) => setOpenDropdownId(open ? 'ji-quartile' : null)}
              onSelectOption={(val) => {
                setQuartileFilter?.(val as QuartileFilterType);
                setCurrentPage(1);
              }}
            />
          </>
        )}

        {/* 3. Filter Khusus Jurnal Nasional: Tahun -> Status SINTA -> Sumber -> Akreditasi */}
        {isJN && (
          <>
            <FilterDropdown
              categoryLabel="Status SINTA"
              options={jnStatusOptions}
              activeValue={scopusFilter}
              isOpen={openDropdownId === 'jn-status'}
              onOpenChange={(open) => setOpenDropdownId(open ? 'jn-status' : null)}
              onSelectOption={(val) => {
                setScopusFilter?.(val as ScopusFilterType);
                setCurrentPage(1);
              }}
            />
            <FilterDropdown
              categoryLabel="Sumber"
              options={sourceOptions}
              activeValue={sourceFilter}
              isOpen={openDropdownId === 'source'}
              onOpenChange={(open) => setOpenDropdownId(open ? 'source' : null)}
              onSelectOption={(val) => {
                setSourceFilter?.(val as SourceFilterType);
                setCurrentPage(1);
              }}
            />
            <FilterDropdown
              categoryLabel="Akreditasi"
              options={sintaOptions}
              activeValue={sintaFilter}
              isOpen={openDropdownId === 'jn-sinta'}
              onOpenChange={(open) => setOpenDropdownId(open ? 'jn-sinta' : null)}
              onSelectOption={(val) => {
                setSintaFilter?.(val as SintaFilterType);
                setCurrentPage(1);
              }}
            />
          </>
        )}

        {/* 4. Filter Sumber Data untuk Kategori Lainnya */}
        {!isJI && !isJN && (
          <FilterDropdown
            categoryLabel="Sumber"
            options={sourceOptions}
            activeValue={sourceFilter}
            isOpen={openDropdownId === 'source'}
            onOpenChange={(open) => setOpenDropdownId(open ? 'source' : null)}
            onSelectOption={(val) => {
              setSourceFilter?.(val as SourceFilterType);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
      
      {/* ── 1. Desktop & Tablet Table View (md ke atas) ── */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-hairline-light dark:divide-hairline-dark text-xs">
          <thead className="bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark">
            <tr>
              <th className="px-5 lg:px-6 py-3.5 text-left text-xs font-semibold text-body dark:text-on-dark-soft min-w-[340px] sm:min-w-[440px]">Judul Publikasi</th>
              <th className="px-4 lg:px-5 py-3.5 text-left text-xs font-semibold text-body dark:text-on-dark-soft w-32 whitespace-nowrap">Dokumen</th>
              <th className="px-4 lg:px-5 py-3.5 text-left text-xs font-semibold text-body dark:text-on-dark-soft w-36 whitespace-nowrap">Status</th>
              <th className="px-4 lg:px-5 py-3.5 text-right sm:text-left text-xs font-semibold text-body dark:text-on-dark-soft w-28 whitespace-nowrap">Poin KPI</th>
              <th className="px-3 py-3.5 w-14 text-center text-xs font-semibold text-body dark:text-on-dark-soft whitespace-nowrap">Detail</th>
              <th className="px-3 py-3.5 w-16 text-center text-xs font-semibold text-body dark:text-on-dark-soft whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-light dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
            {isTableLoading ? (
              <phantom-ui loading={true} animation="shimmer" className="contents">
                {[1, 2, 3].map((i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-hairline-light dark:border-hairline-dark last:border-0">
                    <td className="px-5 lg:px-6 py-4 lg:py-5">
                      <div className="flex items-start gap-3 lg:gap-4">
                        <div className="h-8 w-8 lg:h-9 lg:w-9 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg shrink-0 mt-0.5"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 w-3/4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded"></div>
                          <div className="h-3 w-1/3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-5 py-4"><div className="h-6 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg"></div></td>
                    <td className="px-4 lg:px-5 py-4"><div className="h-6 w-24 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg"></div></td>
                    <td className="px-4 lg:px-5 py-4"><div className="h-6 w-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg ml-auto sm:ml-0"></div></td>
                    <td className="px-3 py-4"><div className="h-7 w-7 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg mx-auto"></div></td>
                    <td className="px-3 py-4"><div className="h-7 w-7 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg mx-auto"></div></td>
                  </tr>
                ))}
              </phantom-ui>
            ) : currentDocuments.length > 0 ? (
              currentDocuments.map((doc: any) => (
                <tr key={doc.id} className="hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors group">
                  <td className="px-5 lg:px-6 py-4 lg:py-5 align-top cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                    <div className="flex items-start gap-3 lg:gap-4">
                      <div className="p-2.5 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl group-hover:bg-hairline-light dark:group-hover:bg-surface-dark transition-colors shrink-0 mt-0.5 border border-hairline-light dark:border-hairline-dark text-muted dark:text-on-dark-muted shadow-2xs">
                        <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <p className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark leading-snug line-clamp-2 hover:underline" title={doc.title}>
                          {doc.title}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-muted dark:text-on-dark-muted flex-wrap">
                          <span className="font-mono text-[11px]">
                            {doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                          </span>
                          <span>•</span>
                          <span className="font-medium">{doc.category}</span>
                          {(doc.source_name || doc.journal) && (
                            <>
                              <span>•</span>
                              <span className="italic truncate max-w-[280px] text-body dark:text-on-dark-soft">
                                {doc.source_name || doc.journal}
                              </span>
                            </>
                          )}
                        </div>

                        {(() => {
                          const normTitle = (doc.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                          const isCrossIndexed = !!doc.is_cross_indexed || (!!crossTitlesSet && crossTitlesSet.has(normTitle));
                          const isExternal = doc.source === 'scopus' || doc.source === 'scholar';
                          return (
                            <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                              {isExternal ? (
                                <span className="px-2 py-0.5 border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft text-[10px] font-semibold rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center gap-1">
                                  API {doc.source === 'scopus' ? 'Scopus' : 'Scholar'}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft text-[10px] font-semibold rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center gap-1">
                                  Manual
                                </span>
                              )}
                              <span className="px-2 py-0.5 border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft text-[10px] font-semibold font-mono rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center gap-1">
                                {doc.citations ?? 0} Sitasi
                              </span>
                              {isCrossIndexed && (
                                <span className="px-2 py-0.5 border border-success-border dark:border-success/30 text-success-dark dark:text-success-on-dark text-[10px] font-semibold rounded-md bg-success-soft dark:bg-success/15 flex items-center gap-1">
                                  Cross-Indexed
                                </span>
                              )}
                              {doc.quartile && (
                                <span className="px-2 py-0.5 border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark text-[10px] font-bold font-mono rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated">
                                  {doc.quartile}
                                </span>
                              )}
                              {doc.sinta_rank && (
                                <span className="px-2 py-0.5 border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark text-[10px] font-bold font-mono rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated">
                                  {doc.sinta_rank}
                                </span>
                              )}
                              {doc.author_role && (
                                <span className="px-2 py-0.5 border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft text-[10px] font-semibold rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated">
                                  {doc.author_role === 'Single Author' ? 'Single' : doc.author_role === 'First Author' ? '1st Author' : 'Co-Author'}
                                </span>
                              )}
                              {doc.is_hyperauthor && (
                                <span className="px-2 py-0.5 border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft text-[10px] font-semibold rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated">
                                  Hyper
                                </span>
                              )}
                            </div>
                          );
                        })()}

                        {(() => {
                          const isJI = doc.category === 'Jurnal Internasional';
                          const isJN = doc.category === 'Jurnal Nasional';
                          if (!isJI && !isJN) return null;

                          const totalAuthors = Number(doc.total_authors) || 1;
                          const showCorrespondingControls = doc.author_role !== 'Single Author' && totalAuthors > 1 && doc.source !== 'scholar';
                          const bd = getBreakdown(doc);
                          const isExpanded = !!expandedPoints[doc.id];

                          return (
                            <div className="pt-1.5 space-y-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                              {bd && (
                                <div className="flex flex-col items-start gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedPoints(prev => ({ ...prev, [doc.id]: !prev[doc.id] }))}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft hover:bg-surface-light dark:hover:bg-surface-dark hover:text-ink-heading dark:hover:text-on-dark cursor-pointer shadow-2xs"
                                  >
                                    <Calculator className="w-3 h-3 text-muted dark:text-on-dark-muted" />
                                    <span>{isExpanded ? 'Tutup Rincian Poin' : 'Rincian Poin'}</span>
                                  </button>

                                  {isExpanded && (
                                    <PointBreakdownBox
                                      doc={doc}
                                      bd={bd}
                                      isCrossIndexed={!!doc.is_cross_indexed || (!!crossTitlesSet && crossTitlesSet.has((doc.title || '').toLowerCase().replace(/[^a-z0-9]/g, '')))}
                                      showCorrespondingControls={showCorrespondingControls}
                                      updatingCorrespondingId={updatingCorrespondingId}
                                      handleToggleCorresponding={handleToggleCorresponding}
                                      setUpdatingCorrespondingId={setUpdatingCorrespondingId}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 lg:px-5 py-4 lg:py-5 align-middle">
                    {doc.file_url && doc.file_url !== '-' ? (
                      <button
                        onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                        className="inline-flex items-center text-xs font-semibold text-body dark:text-on-dark-soft hover:text-ink-heading dark:hover:text-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark px-2.5 py-1.5 rounded-lg border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1 text-muted dark:text-on-dark-muted" /> Lihat
                      </button>
                    ) : doc.source ? (
                      <span 
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted dark:text-on-dark-muted bg-surface-light-raised dark:bg-surface-dark-elevated px-2.5 py-1.5 rounded-lg border border-hairline-light dark:border-hairline-dark whitespace-nowrap"
                        title="Publikasi tersinkronisasi via API, tidak memerlukan unggah berkas manual"
                      >
                        <RefreshCw className="w-3 h-3 text-muted dark:text-on-dark-muted" />
                        <span>Sinkron API</span>
                      </span>
                    ) : (
                      <label className="inline-flex items-center text-xs font-semibold text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark cursor-pointer bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark px-2.5 py-1.5 rounded-lg border border-hairline-light dark:border-hairline-dark transition-colors">
                        {uploadingPdfId === doc.id ? (
                          <span className="animate-pulse">Uploading...</span>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 mr-1 text-muted dark:text-on-dark-muted" />
                            Upload
                            <input type="file" accept=".pdf" className="sr-only" onChange={(e) => handleUploadPdf(e, doc.id)} disabled={uploadingPdfId === doc.id} />
                          </>
                        )}
                      </label>
                    )}
                  </td>

                  <td className="px-4 lg:px-5 py-4 lg:py-5 align-middle">
                    {(() => {
                      const st = (doc.status || '').toLowerCase();
                      const isApproved = st === 'approved';
                      const isRejected = st === 'rejected';
                      const isVerified = st.includes('verified') || st.includes('fakultas');

                      return (
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full font-semibold text-[11px] border whitespace-nowrap ${
                          isApproved ? 'bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark border-success-border dark:border-success/30' :
                          isRejected ? 'bg-error-soft dark:bg-error/15 text-error dark:text-error-on-dark border-error-border dark:border-error/30' :
                          isVerified ? 'bg-accent-soft dark:bg-accent/15 text-accent-hover dark:text-accent-on-dark border-accent-border dark:border-accent/30' :
                          'bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark border-warning-border dark:border-warning/30'
                        }`}>
                          {isApproved && <CheckCircle className="w-3.5 h-3.5 mr-1 text-success dark:text-success-on-dark" />}
                          {isRejected && <XCircle className="w-3.5 h-3.5 mr-1 text-error dark:text-error-on-dark" />}
                          {(!isApproved && !isRejected) && <Clock className="w-3.5 h-3.5 mr-1 text-warning dark:text-warning-on-dark" />}
                          <span>{isVerified ? 'Verified (Fakultas)' : isApproved ? 'Approved' : isRejected ? 'Rejected' : doc.status || 'Pending'}</span>
                        </div>
                      );
                    })()}
                  </td>

                  {/* Poin */}
                  <td className="px-4 lg:px-5 py-4 lg:py-5 align-middle text-right sm:text-left">
                    <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-ink-heading dark:text-on-dark whitespace-nowrap">
                      +{Math.round(doc.source === 'scholar' ? calculateScholarPoints(doc) : (doc.awarded_points ?? 0))} Pts
                    </span>
                  </td>

                  {/* View Detail Button */}
                  <td className="px-3 py-4 lg:py-5 text-center align-middle">
                    <button
                      type="button"
                      onClick={() => setSelectedDocForDetail(doc)}
                      className="p-1.5 rounded-lg bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark border border-hairline-light dark:border-hairline-dark transition-all flex items-center justify-center mx-auto cursor-pointer shadow-2xs"
                      title="Lihat Detail"
                      aria-label="Lihat Detail Publikasi"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-4 lg:py-5 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                    {(() => {
                      const isLocked = doc.status === 'Approved' || (doc.status || '').toLowerCase().includes('verified');
                      return (
                        <div className="flex items-center justify-center gap-1.5">
                          {!isLocked ? (
                            <>
                              <button
                                onClick={() => openEditModal(doc)}
                                className="p-1.5 rounded-lg bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark border border-hairline-light dark:border-hairline-dark transition-all cursor-pointer shadow-2xs"
                                title="Edit Publikasi"
                                aria-label="Edit Publikasi"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => { setDeleteDoc(doc); setIsDeleteModalOpen(true); }}
                                className="p-1.5 rounded-lg bg-surface-light-raised hover:bg-error-soft dark:bg-surface-dark-elevated dark:hover:bg-error/15 text-muted hover:text-error dark:text-on-dark-muted dark:hover:text-error-on-dark border border-hairline-light dark:border-hairline-dark hover:border-error-border dark:hover:border-error/30 transition-all cursor-pointer shadow-2xs"
                                title="Hapus Publikasi"
                                aria-label="Hapus Publikasi"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <span 
                              className="p-1.5 rounded-lg bg-surface-light-raised/50 dark:bg-surface-dark-elevated/50 text-muted/60 dark:text-on-dark-muted/50 border border-hairline-light/60 dark:border-hairline-dark/60 inline-flex items-center justify-center cursor-not-allowed"
                              title="Publikasi terkunci karena sudah disetujui / diverifikasi"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 lg:px-6 py-16 text-center text-muted dark:text-on-dark-muted font-medium text-xs">
                  Belum ada data publikasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── 2. Mobile Responsive Card List View (< md) ── */}
      <div className="block md:hidden divide-y divide-hairline-light dark:divide-hairline-dark">
        {isTableLoading ? (
          <phantom-ui loading={true} animation="shimmer" className="contents">
            {[1, 2, 3].map((i) => (
              <div key={`m-skeleton-${i}`} className="p-4 space-y-3 bg-surface-light dark:bg-surface-dark">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-9 w-9 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl shrink-0 mt-0.5" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded" />
                      <div className="h-3 w-1/2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded" />
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg shrink-0" />
                </div>
                <div className="flex gap-1.5 pt-1">
                  <div className="h-5 w-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md" />
                  <div className="h-5 w-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md" />
                  <div className="h-5 w-14 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-md" />
                </div>
                <div className="pt-2 border-t border-hairline-light-soft dark:border-hairline-dark-soft flex items-center justify-between">
                  <div className="h-6 w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-full" />
                  <div className="flex gap-1.5">
                    <div className="h-7 w-7 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg" />
                    <div className="h-7 w-7 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </phantom-ui>
        ) : currentDocuments.length > 0 ? (
          currentDocuments.map((doc: any) => {
            const isApproved = (doc.status || '').toLowerCase() === 'approved';
            const isRejected = (doc.status || '').toLowerCase() === 'rejected';
            const isVerified = (doc.status || '').toLowerCase().includes('verified') || (doc.status || '').toLowerCase().includes('fakultas');
            const isLocked = doc.status === 'Approved' || (doc.status || '').toLowerCase().includes('verified');
            
            const normTitle = (doc.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const isCrossIndexed = !!doc.is_cross_indexed || (!!crossTitlesSet && crossTitlesSet.has(normTitle));
            const isExternal = doc.source === 'scopus' || doc.source === 'scholar';
            
            const isJI = doc.category === 'Jurnal Internasional';
            const isJN = doc.category === 'Jurnal Nasional';
            const totalAuthors = Number(doc.total_authors) || 1;
            const showCorrespondingControls = doc.author_role !== 'Single Author' && totalAuthors > 1 && doc.source !== 'scholar';
            const bd = (isJI || isJN) ? getBreakdown(doc) : null;
            const isExpanded = !!expandedPoints[doc.id];
            
            const pointsVal = Math.round(doc.source === 'scholar' ? calculateScholarPoints(doc) : (doc.awarded_points ?? 0));

            return (
              <div 
                key={doc.id}
                className="p-4 space-y-3 bg-surface-light dark:bg-surface-dark hover:bg-surface-light-raised/40 dark:hover:bg-surface-dark-elevated/40 transition-colors"
              >
                {/* Top Section: Title & Points */}
                <div className="flex items-start justify-between gap-2.5">
                  <div 
                    className="flex items-start gap-2.5 flex-1 min-w-0 cursor-pointer group"
                    onClick={() => setSelectedDocForDetail(doc)}
                  >
                    <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl group-hover:bg-hairline-light dark:group-hover:bg-surface-dark transition-colors shrink-0 mt-0.5 border border-hairline-light dark:border-hairline-dark text-muted dark:text-on-dark-muted shadow-2xs">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark leading-snug line-clamp-2 hover:underline" title={doc.title}>
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted dark:text-on-dark-muted flex-wrap mt-1 font-mono">
                        <span>{doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</span>
                        <span>•</span>
                        <span className="font-sans font-medium">{doc.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Point Badge */}
                  <div className="shrink-0 flex flex-col items-end">
                    <span className="px-2.5 py-1 rounded-lg bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark text-xs font-bold font-mono tabular-nums border border-hairline-light dark:border-hairline-dark whitespace-nowrap shadow-2xs">
                      +{pointsVal} Pts
                    </span>
                  </div>
                </div>

                {/* Journal / Source Name if any */}
                {(doc.source_name || doc.journal) && (
                  <p className="text-[11px] italic text-body dark:text-on-dark-soft line-clamp-1">
                    {doc.source_name || doc.journal}
                  </p>
                )}

                {/* Badges / Chips */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {isExternal ? (
                    <span className="px-2 py-0.5 border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft text-[10px] font-semibold rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center gap-1">
                      API {doc.source === 'scopus' ? 'Scopus' : 'Scholar'}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft text-[10px] font-semibold rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center gap-1">
                      Manual
                    </span>
                  )}
                  <span className="px-2 py-0.5 border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft text-[10px] font-semibold font-mono rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated flex items-center gap-1">
                    {doc.citations ?? 0} Sitasi
                  </span>
                  {isCrossIndexed && (
                    <span className="px-2 py-0.5 border border-success-border dark:border-success/30 text-success-dark dark:text-success-on-dark text-[10px] font-semibold rounded-md bg-success-soft dark:bg-success/15 flex items-center gap-1">
                      Cross-Indexed
                    </span>
                  )}
                  {doc.quartile && (
                    <span className="px-2 py-0.5 border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark text-[10px] font-bold font-mono rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated">
                      {doc.quartile}
                    </span>
                  )}
                  {doc.sinta_rank && (
                    <span className="px-2 py-0.5 border border-hairline-light dark:border-hairline-dark text-ink-heading dark:text-on-dark text-[10px] font-bold font-mono rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated">
                      {doc.sinta_rank}
                    </span>
                  )}
                  {doc.author_role && (
                    <span className="px-2 py-0.5 border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft text-[10px] font-semibold rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated">
                      {doc.author_role === 'Single Author' ? 'Single' : doc.author_role === 'First Author' ? '1st Author' : 'Co-Author'}
                    </span>
                  )}
                  {doc.is_hyperauthor && (
                    <span className="px-2 py-0.5 border border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft text-[10px] font-semibold rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated">
                      Hyper
                    </span>
                  )}
                </div>

                {/* Point Breakdown Collapsible for Mobile */}
                {bd && (
                  <div className="pt-0.5 space-y-2">
                    <button
                      type="button"
                      onClick={() => setExpandedPoints(prev => ({ ...prev, [doc.id]: !prev[doc.id] }))}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft hover:bg-surface-light dark:hover:bg-surface-dark hover:text-ink-heading dark:hover:text-on-dark cursor-pointer shadow-2xs"
                    >
                      <Calculator className="w-3 h-3 text-muted dark:text-on-dark-muted" />
                      <span>{isExpanded ? 'Tutup Rincian Poin' : 'Rincian Poin'}</span>
                    </button>

                    {isExpanded && (
                      <PointBreakdownBox
                        doc={doc}
                        bd={bd}
                        isCrossIndexed={isCrossIndexed}
                        showCorrespondingControls={showCorrespondingControls}
                        updatingCorrespondingId={updatingCorrespondingId}
                        handleToggleCorresponding={handleToggleCorresponding}
                        setUpdatingCorrespondingId={setUpdatingCorrespondingId}
                      />
                    )}
                  </div>
                )}

                {/* Card Footer: Status & Actions */}
                <div className="pt-2.5 border-t border-hairline-light-soft dark:border-hairline-dark-soft flex items-center justify-between gap-2 flex-wrap">
                  {/* Left: Status & File Button */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status Badge */}
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full font-semibold text-[11px] border whitespace-nowrap ${
                      isApproved ? 'bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark border-success-border dark:border-success/30' :
                      isRejected ? 'bg-error-soft dark:bg-error/15 text-error dark:text-error-on-dark border-error-border dark:border-error/30' :
                      isVerified ? 'bg-accent-soft dark:bg-accent/15 text-accent-hover dark:text-accent-on-dark border-accent-border dark:border-accent/30' :
                      'bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark border-warning-border dark:border-warning/30'
                    }`}>
                      {isApproved && <CheckCircle className="w-3.5 h-3.5 mr-1 text-success dark:text-success-on-dark" />}
                      {isRejected && <XCircle className="w-3.5 h-3.5 mr-1 text-error dark:text-error-on-dark" />}
                      {(!isApproved && !isRejected) && <Clock className="w-3.5 h-3.5 mr-1 text-warning dark:text-warning-on-dark" />}
                      <span>{isVerified ? 'Verified (Fakultas)' : isApproved ? 'Approved' : isRejected ? 'Rejected' : doc.status || 'Pending'}</span>
                    </div>

                    {/* File Action */}
                    {doc.file_url && doc.file_url !== '-' ? (
                      <button
                        onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                        className="inline-flex items-center text-xs font-semibold text-body dark:text-on-dark-soft hover:text-ink-heading dark:hover:text-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark px-2.5 py-1 rounded-lg border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1 text-muted dark:text-on-dark-muted" /> Lihat
                      </button>
                    ) : doc.source ? (
                      <span 
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-muted dark:text-on-dark-muted bg-surface-light-raised dark:bg-surface-dark-elevated px-2 py-1 rounded-lg border border-hairline-light dark:border-hairline-dark whitespace-nowrap"
                        title="Publikasi tersinkronisasi via API, tidak memerlukan unggah berkas manual"
                      >
                        <RefreshCw className="w-3 h-3 text-muted dark:text-on-dark-muted" />
                        <span>API</span>
                      </span>
                    ) : (
                      <label className="inline-flex items-center text-xs font-semibold text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark cursor-pointer bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark px-2.5 py-1 rounded-lg border border-hairline-light dark:border-hairline-dark transition-colors">
                        {uploadingPdfId === doc.id ? (
                          <span className="animate-pulse">Uploading...</span>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 mr-1 text-muted dark:text-on-dark-muted" />
                            Upload
                            <input type="file" accept=".pdf" className="sr-only" onChange={(e) => handleUploadPdf(e, doc.id)} disabled={uploadingPdfId === doc.id} />
                          </>
                        )}
                      </label>
                    )}
                  </div>

                  {/* Right: Actions (Detail, Edit, Delete / Lock) */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      type="button"
                      onClick={() => setSelectedDocForDetail(doc)}
                      className="p-1.5 rounded-lg bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark border border-hairline-light dark:border-hairline-dark transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                      title="Lihat Detail"
                      aria-label="Lihat Detail Publikasi"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    {!isLocked ? (
                      <>
                        <button
                          onClick={() => openEditModal(doc)}
                          className="p-1.5 rounded-lg bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark border border-hairline-light dark:border-hairline-dark transition-all cursor-pointer shadow-2xs"
                          title="Edit Publikasi"
                          aria-label="Edit Publikasi"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setDeleteDoc(doc); setIsDeleteModalOpen(true); }}
                          className="p-1.5 rounded-lg bg-surface-light-raised hover:bg-error-soft dark:bg-surface-dark-elevated dark:hover:bg-error/15 text-muted hover:text-error dark:text-on-dark-muted dark:hover:text-error-on-dark border border-hairline-light dark:border-hairline-dark hover:border-error-border dark:hover:border-error/30 transition-all cursor-pointer shadow-2xs"
                          title="Hapus Publikasi"
                          aria-label="Hapus Publikasi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <span 
                        className="p-1.5 rounded-lg bg-surface-light-raised/50 dark:bg-surface-dark-elevated/50 text-muted/60 dark:text-on-dark-muted/50 border border-hairline-light/60 dark:border-hairline-dark/60 inline-flex items-center justify-center cursor-not-allowed"
                        title="Publikasi terkunci karena sudah disetujui / diverifikasi"
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-muted dark:text-on-dark-muted font-medium text-xs">
            Belum ada data publikasi.
          </div>
        )}
      </div>

      {/* === Pagination Controls === */}
      {!isTableLoading && filteredDocuments.length > 0 && (
        <div className="px-4 sm:px-6 py-4 border-t border-hairline-light dark:border-hairline-dark bg-surface-light-raised/50 dark:bg-surface-dark/50 flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-4 w-full sm:w-auto text-center sm:text-left">
            <span className="text-xs text-muted dark:text-on-dark-muted">
              Menampilkan <span className="font-semibold font-mono text-ink-heading dark:text-on-dark">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredDocuments.length)}</span> dari <span className="font-semibold font-mono text-ink-heading dark:text-on-dark">{filteredDocuments.length}</span> Dokumen
            </span>
            <div className="h-4 w-px bg-hairline-light dark:bg-hairline-dark hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted dark:text-on-dark-muted">Limit:</span>
              <DropdownSelect
                value={itemsPerPage}
                onChange={(val) => {
                  setItemsPerPage(val);
                  setCurrentPage(1);
                }}
                options={[
                  { value: 10, label: "10" },
                  { value: 25, label: "25" },
                  { value: 50, label: "50" },
                  { value: 100, label: "100" }
                ]}
                size="sm"
                className="w-[85px]"
                position="top"
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 w-full sm:w-auto">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-2 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
              aria-label="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, index, array) => (
                  <React.Fragment key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="px-1 text-muted dark:text-on-dark-muted text-xs">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-[34px] h-8 flex items-center justify-center rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                        currentPage === p 
                          ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-2xs' 
                          : 'bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-2 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
              aria-label="Halaman Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
