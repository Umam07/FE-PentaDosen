import React, { useState } from 'react';
import { 
  FileText, Upload, CheckCircle, XCircle, Clock, 
  Info, ChevronLeft, ChevronRight, Pencil, Trash2, Lock
} from 'lucide-react';
import YearFilterBar from '../../../../components/ui/YearFilterBar';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import { calculateScholarPoints } from '../../dashboard/pointsCalculator';
import PointBreakdownBox from './PointBreakdownBox';

interface PublicationTableProps {
  isTableLoading: boolean;
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
}

export default function PublicationTable({
  isTableLoading,
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
}: PublicationTableProps) {
  const isDocLocked = (doc: any) =>
    doc.status === 'Verified by Fakultas' || doc.status === 'Approved';

  const [expandedPoints, setExpandedPoints] = useState<Record<string | number, boolean>>({});
  const [updatingCorrespondingId, setUpdatingCorrespondingId] = useState<string | number | null>(null);

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
      <div className="p-5 border-b border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark">
        <h3 className="text-base font-bold text-ink-heading dark:text-on-dark tracking-tight">Riwayat Publikasi</h3>
      </div>

      {/* Year Filter */}
      <YearFilterBar
        availableYears={availableYears}
        selectedYear={filterYear}
        onYearChange={onYearChange}
      />
      
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-hairline-light dark:divide-hairline-dark text-xs">
          <thead className="bg-surface-light-raised dark:bg-surface-dark-elevated border-b border-hairline-light dark:border-hairline-dark">
            <tr>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-body dark:text-on-dark-soft">Judul Publikasi</th>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-body dark:text-on-dark-soft">Dokumen</th>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-body dark:text-on-dark-soft">Status</th>
              <th className="px-4 lg:px-6 py-3.5 text-right sm:text-left text-xs font-semibold text-body dark:text-on-dark-soft">Poin KPI</th>
              <th className="px-4 py-3.5 w-12 text-center text-xs font-semibold text-body dark:text-on-dark-soft">Detail</th>
              <th className="px-4 py-3.5 w-16 text-center text-xs font-semibold text-body dark:text-on-dark-soft">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-light dark:divide-hairline-dark-soft bg-surface-light dark:bg-surface-dark">
            {isTableLoading ? (
              <phantom-ui loading={true} animation="shimmer" className="contents">
                {[1, 2, 3].map((i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-hairline-light dark:border-hairline-dark last:border-0">
                    <td className="px-4 lg:px-6 py-4 lg:py-5">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="h-8 w-8 lg:h-9 lg:w-9 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg shrink-0"></div>
                        <div className="space-y-2 w-full max-w-[120px] sm:max-w-[200px]">
                          <div className="h-3 lg:h-4 w-full bg-surface-light-raised dark:bg-surface-dark-elevated rounded"></div>
                          <div className="h-2 lg:h-3 w-2/3 bg-surface-light-raised dark:bg-surface-dark-elevated rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4"><div className="h-6 w-16 lg:w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg"></div></td>
                    <td className="px-4 lg:px-6 py-4"><div className="h-6 w-16 lg:w-20 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg"></div></td>
                    <td className="px-4 lg:px-6 py-4 flex justify-end sm:justify-start"><div className="h-6 lg:h-8 w-10 lg:w-16 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg"></div></td>
                    <td className="px-4 py-4 w-12"><div className="h-4 w-4 bg-surface-light-raised dark:bg-surface-dark-elevated rounded mx-auto"></div></td>
                    <td className="px-4 py-4 w-16"><div className="h-4 w-10 bg-surface-light-raised dark:bg-surface-dark-elevated rounded mx-auto"></div></td>
                  </tr>
                ))}
              </phantom-ui>
            ) : currentDocuments.length > 0 ? (
              currentDocuments.map((doc: any) => (
                <tr key={doc.id} className="hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors group">
                  {/* Informasi Publikasi */}
                  <td className="px-4 lg:px-6 py-4 lg:py-5 align-middle cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                    <div className="flex items-start gap-3 lg:gap-4">
                      <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-lg group-hover:bg-hairline-light dark:group-hover:bg-surface-dark transition-colors shrink-0 mt-0.5 border border-hairline-light dark:border-hairline-dark text-muted dark:text-on-dark-muted">
                        <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
                      </div>
                      <div className="min-w-0 flex-1 max-w-[150px] sm:max-w-[250px] lg:max-w-md">
                        <p className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark truncate" title={doc.title}>{doc.title}</p>
                        <p className="text-[11px] text-muted dark:text-on-dark-muted truncate mt-0.5" title={doc.category}>
                          <span className="font-mono">{doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'} • </span>
                          <span>{doc.category}</span>
                        </p>
                        {(() => {
                          const normTitle = (doc.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                          const isCrossIndexed = !!doc.is_cross_indexed || (!!crossTitlesSet && crossTitlesSet.has(normTitle));
                          const isExternal = doc.source === 'scopus' || doc.source === 'scholar';
                          return (
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
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
                              {/* Corresponding Author Status Badge for Jurnal Internasional */}
                              {(doc.category === 'Jurnal Internasional' || doc.source === 'scopus') && (
                                <>
                                  {doc.is_corresponding && doc.is_corresponding_confirmed && (
                                    <span className="px-2 py-0.5 bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark text-[10px] font-semibold rounded-md border border-success-border dark:border-success/30 flex items-center gap-1">
                                      ✓ Corresponding
                                    </span>
                                  )}
                                  {!doc.is_corresponding && doc.is_corresponding_confirmed && (
                                    <span className="px-2 py-0.5 bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft text-[10px] font-semibold rounded-md border border-hairline-light dark:border-hairline-dark">
                                      Non-Corresponding
                                    </span>
                                  )}
                                  {!doc.is_corresponding_confirmed && Number(doc.total_authors || 1) > 1 && (
                                    <span className="px-2 py-0.5 bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark border border-warning-border dark:border-warning/30 text-[10px] font-semibold rounded-md">
                                      Perlu Konfirmasi
                                    </span>
                                  )}
                                </>
                              )}

                              {/* SINTA Status Badge for Jurnal Nasional */}
                              {(doc.category === 'Jurnal Nasional' || doc.source === 'scholar') && (
                                <>
                                  {doc.sinta_rank && doc.sinta_rank !== 'Non-SINTA' && (
                                    <span className="px-2 py-0.5 bg-accent-soft dark:bg-accent/15 text-accent-hover dark:text-accent-on-dark text-[10px] font-semibold font-mono rounded-md border border-accent-border dark:border-accent/30">
                                      {doc.sinta_rank}
                                    </span>
                                  )}
                                  {doc.is_sinta_confirmed && (!doc.sinta_rank || doc.sinta_rank === 'Non-SINTA') && (
                                    <span className="px-2 py-0.5 bg-surface-light-raised dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft text-[10px] font-semibold rounded-md border border-hairline-light dark:border-hairline-dark">
                                      Non-SINTA
                                    </span>
                                  )}
                                  {!doc.is_sinta_confirmed && (!doc.sinta_rank || doc.sinta_rank === 'Non-SINTA') && (
                                    <span className="px-2 py-0.5 bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark border border-warning-border dark:border-warning/30 text-[10px] font-semibold rounded-md">
                                      Perlu Konfirmasi SINTA
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })()}

                        {/* Breakdown Controls (Individual Toggle di dalam Rincian Poin) */}
                        {(() => {
                          const isJI = doc.category === 'Jurnal Internasional';
                          const isJN = doc.category === 'Jurnal Nasional';
                          if (!isJI && !isJN) return null;

                          const totalAuthors = Number(doc.total_authors) || 1;
                          const showCorrespondingControls = doc.author_role !== 'Single Author' && totalAuthors > 1 && doc.source !== 'scholar';
                          const bd = getBreakdown(doc);
                          const isExpanded = !!expandedPoints[doc.id];

                          return (
                            <div className="mt-2 space-y-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                              {bd && (
                                <div className="flex flex-col items-start gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedPoints(prev => ({ ...prev, [doc.id]: !prev[doc.id] }))}
                                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark-elevated text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark cursor-pointer shadow-2xs"
                                  >
                                    {isExpanded ? '▲ Sembunyikan' : '▼ Rincian Poin'}
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

                  {/* Dokumen */}
                  <td className="px-4 lg:px-6 py-4 lg:py-5 align-middle">
                    {doc.file_url && doc.file_url !== '-' ? (
                      <button
                        onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                        className="inline-flex items-center text-xs font-semibold text-body dark:text-on-dark-soft hover:text-ink-heading dark:hover:text-on-dark bg-surface-light-raised dark:bg-surface-dark-elevated hover:bg-surface-light dark:hover:bg-surface-dark px-2.5 py-1 rounded-lg border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1 text-muted dark:text-on-dark-muted" /> Lihat
                      </button>
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
                  </td>

                  {/* Status */}
                  <td className="px-4 lg:px-6 py-4 lg:py-5 align-middle">
                    {(() => {
                      const st = (doc.status || '').toLowerCase();
                      const isApproved = st === 'approved';
                      const isRejected = st === 'rejected';
                      const isVerified = st.includes('verified') || st.includes('fakultas');

                      return (
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${
                          isApproved ? 'bg-success-soft dark:bg-success/15 text-success-dark dark:text-success-on-dark border-success-border dark:border-success/30' :
                          isRejected ? 'bg-error-soft dark:bg-error/15 text-error dark:text-error-on-dark border-error-border dark:border-error/30' :
                          isVerified ? 'bg-accent-soft dark:bg-accent/15 text-accent-hover dark:text-accent-on-dark border-accent-border dark:border-accent/30' :
                          'bg-warning-soft dark:bg-warning/15 text-warning dark:text-warning-on-dark border-warning-border dark:border-warning/30'
                        }`}>
                          {isApproved && <CheckCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 text-success dark:text-success-on-dark" />}
                          {isRejected && <XCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 text-error dark:text-error-on-dark" />}
                          {(!isApproved && !isRejected) && <Clock className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 text-warning dark:text-warning-on-dark" />}
                          <span className="hidden sm:inline">{isVerified ? 'Verified (Fakultas)' : isApproved ? 'Approved' : isRejected ? 'Rejected' : doc.status || 'Pending'}</span>
                          <span className="sm:hidden">{isApproved ? 'OK' : isRejected ? 'NO' : isVerified ? 'V-FAK' : 'Wait'}</span>
                        </div>
                      );
                    })()}
                  </td>

                  {/* Poin */}
                  <td className="px-4 lg:px-6 py-4 lg:py-5 align-middle text-right sm:text-left">
                    <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-ink-heading dark:text-on-dark whitespace-nowrap">
                      +{Math.round(doc.source === 'scholar' ? calculateScholarPoints(doc) : (doc.awarded_points ?? 0))} Pts
                    </span>
                  </td>

                  {/* View Detail Button */}
                  <td className="px-4 py-4 text-center align-middle">
                    <button
                      type="button"
                      onClick={() => setSelectedDocForDetail(doc)}
                      className="p-1.5 rounded-lg bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark border border-hairline-light dark:border-hairline-dark transition-all flex items-center justify-center mx-auto cursor-pointer"
                      title="Lihat Detail"
                      aria-label="Lihat Detail Publikasi"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </td>

                  {/* Aksi */}
                  <td className="px-4 py-4 text-center align-middle">
                    {doc.source ? (
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          type="button" 
                          onClick={() => { setDeleteDoc(doc); setIsDeleteModalOpen(true); }}
                          className="p-1.5 rounded-lg bg-surface-light-raised hover:bg-error-soft dark:bg-surface-dark-elevated dark:hover:bg-error/15 text-muted hover:text-error dark:text-on-dark-muted dark:hover:text-error-on-dark border border-hairline-light dark:border-hairline-dark transition-all cursor-pointer" 
                          title="Hapus Publikasi"
                          aria-label="Hapus Publikasi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : isDocLocked(doc) ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-light-raised dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted text-[10px] font-semibold cursor-not-allowed border border-hairline-light dark:border-hairline-dark" title="Dokumen sudah diverifikasi — tidak dapat diubah">
                        <Lock className="w-3 h-3" /> Terkunci
                      </span>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          type="button" 
                          onClick={() => openEditModal(doc)}
                          className="p-1.5 rounded-lg bg-surface-light-raised hover:bg-surface-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-muted hover:text-ink-heading dark:text-on-dark-muted dark:hover:text-on-dark border border-hairline-light dark:border-hairline-dark transition-all cursor-pointer" 
                          title="Edit Publikasi"
                          aria-label="Edit Publikasi"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => { setDeleteDoc(doc); setIsDeleteModalOpen(true); }}
                          className="p-1.5 rounded-lg bg-surface-light-raised hover:bg-error-soft dark:bg-surface-dark-elevated dark:hover:bg-error/15 text-muted hover:text-error dark:text-on-dark-muted dark:hover:text-error-on-dark border border-hairline-light dark:border-hairline-dark transition-all cursor-pointer" 
                          title="Hapus Publikasi"
                          aria-label="Hapus Publikasi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
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

      {/* === Pagination Controls === */}
      {!isTableLoading && filteredDocuments.length > 0 && (
        <div className="px-6 py-4 border-t border-hairline-light dark:border-hairline-dark bg-surface-light-raised/50 dark:bg-surface-dark/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted dark:text-on-dark-muted">
              Menampilkan <span className="font-semibold font-mono text-ink-heading dark:text-on-dark">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredDocuments.length)}</span> dari <span className="font-semibold font-mono text-ink-heading dark:text-on-dark">{filteredDocuments.length}</span> Dokumen
            </span>
            <div className="h-4 w-px bg-hairline-light dark:bg-hairline-dark hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
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

          <div className="flex items-center gap-1.5">
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
