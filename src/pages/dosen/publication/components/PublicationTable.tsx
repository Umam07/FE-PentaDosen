import React, { useState } from 'react';
import { 
  FileText, Upload, CheckCircle, XCircle, Clock, 
  Info, ChevronLeft, ChevronRight, Pencil, Trash2, Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
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

    if (doc.source === 'scholar' || Number(doc.citations || 0) > 0) {
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
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
      <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Riwayat Publikasi</h3>
      </div>

      {/* Year Filter */}
      <YearFilterBar
        availableYears={availableYears}
        selectedYear={filterYear}
        onYearChange={onYearChange}
      />
      
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200/80 dark:divide-slate-800 text-xs">
          <thead className="bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800">
            <tr>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Judul Publikasi</th>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Dokumen</th>
              <th className="px-4 lg:px-6 py-3.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="px-4 lg:px-6 py-3.5 text-right sm:text-left text-xs font-semibold text-slate-600 dark:text-slate-300">Poin KPI</th>
              <th className="px-4 py-3.5 w-12 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">Detail</th>
              <th className="px-4 py-3.5 w-16 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
            {isTableLoading ? (
              <phantom-ui loading={true} animation="shimmer" className="contents">
                {[1, 2, 3].map((i) => (
                  <tr key={`skeleton-${i}`} className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="px-4 lg:px-8 py-4 lg:py-5">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="h-8 w-8 lg:h-9 lg:w-9 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0"></div>
                        <div className="space-y-2 w-full max-w-[120px] sm:max-w-[200px]">
                          <div className="h-3 lg:h-4 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                          <div className="h-2 lg:h-3 w-2/3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-8 py-4"><div className="h-6 w-16 lg:w-20 bg-slate-200 dark:bg-slate-700 rounded-xl"></div></td>
                    <td className="px-4 lg:px-8 py-4"><div className="h-6 w-16 lg:w-20 bg-slate-200 dark:bg-slate-700 rounded-xl"></div></td>
                    <td className="px-4 lg:px-8 py-4 flex justify-end sm:justify-start"><div className="h-6 lg:h-8 w-10 lg:w-16 bg-slate-200 dark:bg-slate-700 rounded-lg"></div></td>
                    <td className="px-4 py-4 w-12"><div className="h-4 w-4 bg-slate-100 dark:bg-slate-800 rounded mx-auto"></div></td>
                    <td className="px-4 py-4 w-16"><div className="h-4 w-10 bg-slate-100 dark:bg-slate-800 rounded mx-auto"></div></td>
                  </tr>
                ))}
              </phantom-ui>
            ) : currentDocuments.length > 0 ? (
              currentDocuments.map((doc: any) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                  {/* Informasi Publikasi */}
                  <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors shrink-0">
                        <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div className="min-w-0 flex-1 max-w-[150px] sm:max-w-[250px] lg:max-w-md">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate" title={doc.title}>{doc.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5" title={doc.category}>
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
                                <span className="px-2 py-0.5 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-md bg-slate-50 dark:bg-slate-800/60 flex items-center gap-1">
                                  API {doc.source === 'scopus' ? 'Scopus' : 'Scholar'}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-md bg-slate-50 dark:bg-slate-800/60 flex items-center gap-1">
                                  Manual
                                </span>
                              )}
                              <span className="px-2 py-0.5 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-semibold font-mono rounded-md bg-slate-50 dark:bg-slate-800/60 flex items-center gap-1">
                                {doc.citations ?? 0} Sitasi
                              </span>
                              {isCrossIndexed && (
                                <span className="px-2 py-0.5 border border-teal-200/80 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[10px] font-semibold rounded-md bg-teal-50 dark:bg-teal-950/30 flex items-center gap-1">
                                  Cross-Indexed
                                </span>
                              )}
                              {doc.quartile && (
                                <span className="px-2 py-0.5 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-semibold font-mono rounded-md bg-slate-50 dark:bg-slate-800/60">
                                  {doc.quartile}
                                </span>
                              )}
                              {doc.author_role && (
                                <span className="px-2 py-0.5 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-md bg-slate-50 dark:bg-slate-800/60">
                                  {doc.author_role === 'Single Author' ? 'Single' : doc.author_role === 'First Author' ? '1st Author' : 'Co-Author'}
                                </span>
                              )}
                              {doc.is_hyperauthor && (
                                <span className="px-2 py-0.5 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-md bg-slate-50 dark:bg-slate-800/60">
                                  Hyper
                                </span>
                              )}
                               {/* Corresponding Author Status Badge for Jurnal Internasional */}
                               {(doc.category === 'Jurnal Internasional' || doc.source === 'scopus') && (
                                 <>
                                   {doc.is_corresponding && doc.is_corresponding_confirmed && (
                                     <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold rounded-md border border-emerald-200/60 dark:border-emerald-900/40 flex items-center gap-1">
                                       ✓ Corresponding
                                     </span>
                                   )}
                                   {!doc.is_corresponding && doc.is_corresponding_confirmed && (
                                     <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-md border border-slate-200/60 dark:border-slate-700/60">
                                       Non-Corresponding
                                     </span>
                                   )}
                                   {!doc.is_corresponding_confirmed && Number(doc.total_authors || 1) > 1 && (
                                     <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40 text-[10px] font-semibold rounded-md">
                                       Perlu Konfirmasi
                                     </span>
                                   )}
                                 </>
                               )}

                               {/* SINTA Status Badge for Jurnal Nasional */}
                               {(doc.category === 'Jurnal Nasional' || doc.source === 'scholar') && (
                                 <>
                                   {doc.sinta_rank && doc.sinta_rank !== 'Non-SINTA' && (
                                     <span className="px-2 py-0.5 bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300 text-[10px] font-semibold font-mono rounded-md border border-sky-200/60 dark:border-sky-900/40">
                                       {doc.sinta_rank}
                                     </span>
                                   )}
                                   {doc.is_sinta_confirmed && (!doc.sinta_rank || doc.sinta_rank === 'Non-SINTA') && (
                                     <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold rounded-md border border-slate-200 dark:border-slate-700">
                                       Non-SINTA
                                     </span>
                                   )}
                                   {!doc.is_sinta_confirmed && (!doc.sinta_rank || doc.sinta_rank === 'Non-SINTA') && (
                                     <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40 text-[10px] font-semibold rounded-md">
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
                                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer shadow-2xs"
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
                  <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                    {doc.file_url && doc.file_url !== '-' ? (
                      <button
                        onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                        className="inline-flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1 text-slate-500" /> Lihat
                      </button>
                    ) : (
                      <label className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors">
                        {uploadingPdfId === doc.id ? (
                          <span className="animate-pulse">Uploading...</span>
                        ) : (
                          <>
                            Upload
                            <input type="file" accept=".pdf" className="sr-only" onChange={(e) => handleUploadPdf(e, doc.id)} disabled={uploadingPdfId === doc.id} />
                          </>
                        )}
                      </label>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                    {(() => {
                      const st = (doc.status || '').toLowerCase();
                      const isApproved = st === 'approved';
                      const isRejected = st === 'rejected';
                      const isVerified = st.includes('verified') || st.includes('fakultas');

                      return (
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${
                          isApproved ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/40' :
                          isRejected ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-900/40' :
                          isVerified ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/60 dark:border-sky-900/40' :
                          'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/40'
                        }`}>
                          {isApproved && <CheckCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />}
                          {isRejected && <XCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 text-rose-600 dark:text-rose-400" />}
                          {(!isApproved && !isRejected) && <Clock className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 text-amber-600 dark:text-amber-400" />}
                          <span className="hidden sm:inline">{isVerified ? 'Verified (Fakultas)' : isApproved ? 'Approved' : isRejected ? 'Rejected' : doc.status || 'Pending'}</span>
                          <span className="sm:hidden">{isApproved ? 'OK' : isRejected ? 'NO' : isVerified ? 'V-FAK' : 'Wait'}</span>
                        </div>
                      );
                    })()}
                  </td>

                  {/* Poin */}
                  <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle text-right sm:text-left">
                    <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-slate-900 dark:text-zinc-100 whitespace-nowrap">
                      +{Math.round((doc.source === 'scholar' || Number(doc.citations || 0) > 0) ? calculateScholarPoints(doc) : (doc.awarded_points ?? 0))} Pts
                    </span>
                  </td>

                  {/* View Detail Button */}
                  <td className="px-4 py-4 text-center align-middle">
                    <button
                      type="button"
                      onClick={() => setSelectedDocForDetail(doc)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all flex items-center justify-center mx-auto cursor-pointer"
                      title="Lihat Detail"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </td>

                  {/* Aksi */}
                  <td className="px-4 py-4 text-center align-middle">
                    {doc.source ? (
                      <div className="flex items-center justify-center gap-1">
                        <button type="button" onClick={() => { setDeleteDoc(doc); setIsDeleteModalOpen(true); }}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer" title="Hapus Publikasi">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : isDocLocked(doc) ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-semibold cursor-not-allowed border border-slate-200/60 dark:border-slate-700/60" title="Dokumen sudah diverifikasi — tidak dapat diubah">
                        <Lock className="w-3 h-3" /> Terkunci
                      </span>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <button type="button" onClick={() => openEditModal(doc)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all cursor-pointer" title="Edit Publikasi">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => { setDeleteDoc(doc); setIsDeleteModalOpen(true); }}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer" title="Hapus Publikasi">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 lg:px-8 py-16 text-center text-slate-400 font-medium text-xs">
                  Belum ada data publikasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === Pagination Controls === */}
      {!isTableLoading && filteredDocuments.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Menampilkan <span className="font-semibold font-mono text-slate-900 dark:text-white">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredDocuments.length)}</span> dari <span className="font-semibold font-mono text-slate-900 dark:text-white">{filteredDocuments.length}</span> Dokumen
            </span>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs text-slate-400">Limit:</span>
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
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, index, array) => (
                  <React.Fragment key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="px-1 text-slate-400 dark:text-slate-600 text-xs">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-[34px] h-8 flex items-center justify-center rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
                        currentPage === p 
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xs' 
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
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
              className="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

