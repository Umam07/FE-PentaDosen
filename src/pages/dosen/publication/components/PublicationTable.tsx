import React, { useState } from 'react';
import { 
  FileText, Upload, CheckCircle, XCircle, Clock, 
  Info, ChevronLeft, ChevronRight, Pencil, Trash2, Lock
} from 'lucide-react';
import { motion } from 'motion/react';
import YearFilterBar from '../../../../components/ui/YearFilterBar';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import { calculateScholarPoints } from '../../dashboard/pointsCalculator';

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
  const [isEditingCorrespondingMap, setIsEditingCorrespondingMap] = useState<Record<string | number, boolean>>({});

  const getBreakdown = (doc: any) => {
    const isJI = doc.category === 'Jurnal Internasional';
    const isJN = doc.category === 'Jurnal Nasional';
    if (!isJI && !isJN) return null;

    if (doc.source === 'scholar') {
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
    const isHyper = !!doc.is_hyperauthor || totalAuthors > 16;
    
    let q = 'None';
    let basePoints = 20; // Default for JN
    let docType = 'Jurnal Nasional';

    if (isJI) {
      q = doc.quartile && ['Q1', 'Q2', 'Q3', 'Q4'].includes(doc.quartile) ? doc.quartile : 'None';
      const basePointsMap: Record<string, number> = { Q1: 40, Q2: 38, Q3: 35, Q4: 33, None: 33 };
      basePoints = basePointsMap[q] ?? 33;
      docType = `Jurnal Internasional ${q !== 'None' ? q : '(Tanpa Quartile)'}`;
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
    <section className="bg-white dark:bg-zinc-900 shadow-sm rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-6 border-b border-gray-50 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/50">
        <h3 className="text-lg lg:text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight uppercase">Riwayat Publikasi</h3>
      </div>

      {/* Year Filter */}
      <YearFilterBar
        availableYears={availableYears}
        selectedYear={filterYear}
        onYearChange={onYearChange}
      />
      
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-50 dark:divide-zinc-800">
          <thead className="bg-gray-50/30 dark:bg-zinc-800/30">
            <tr>
              <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Judul Publikasi</th>
              <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Dokumen</th>
              <th className="px-4 lg:px-8 py-4 text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Status</th>
              <th className="px-4 lg:px-8 py-4 text-right sm:text-left text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Poin KPI</th>
              <th className="px-4 py-4 w-12 text-center text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Detail</th>
              <th className="px-4 py-4 w-16 text-center text-[10px] font-black text-gray-400 dark:text-zinc-400 uppercase tracking-[0.15em]">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-50 dark:divide-zinc-800">
            {isTableLoading ? (
              <phantom-ui loading={true} animation="shimmer" className="contents">
                {[1, 2, 3].map((i) => (
                  <tr key={`skeleton-${i}`} className="bg-white dark:bg-zinc-900 border-b border-gray-50 dark:border-zinc-800 last:border-0">
                    <td className="px-4 lg:px-8 py-4 lg:py-5">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="h-8 w-8 lg:h-9 lg:w-9 bg-gray-100 dark:bg-zinc-800 rounded-lg shrink-0"></div>
                        <div className="space-y-2 w-full max-w-[120px] sm:max-w-[200px]">
                          <div className="h-3 lg:h-4 w-full bg-gray-200 dark:bg-zinc-700 rounded"></div>
                          <div className="h-2 lg:h-3 w-2/3 bg-gray-100 dark:bg-zinc-800 rounded"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 lg:px-8 py-4"><div className="h-6 w-16 lg:w-20 bg-gray-200 dark:bg-zinc-700 rounded-xl"></div></td>
                    <td className="px-4 lg:px-8 py-4"><div className="h-6 w-16 lg:w-20 bg-gray-200 dark:bg-zinc-700 rounded-xl"></div></td>
                    <td className="px-4 lg:px-8 py-4 flex justify-end sm:justify-start"><div className="h-6 lg:h-8 w-10 lg:w-16 bg-gray-200 dark:bg-zinc-700 rounded-lg"></div></td>
                    <td className="px-4 py-4 w-12"><div className="h-4 w-4 bg-gray-100 dark:bg-zinc-800 rounded mx-auto"></div></td>
                    <td className="px-4 py-4 w-16"><div className="h-4 w-10 bg-gray-100 dark:bg-zinc-800 rounded mx-auto"></div></td>
                  </tr>
                ))}
              </phantom-ui>
            ) : currentDocuments.length > 0 ? (
              currentDocuments.map((doc: any) => (
                <tr key={doc.id} className="hover:bg-primary-50/10 dark:hover:bg-primary-900/5 transition-colors group border-b border-gray-50 dark:border-zinc-800 last:border-0">
                  {/* Informasi Publikasi */}
                  <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle cursor-pointer" onClick={() => setSelectedDocForDetail(doc)}>
                    <div className="flex items-center gap-3 lg:gap-4">
                      <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors shrink-0">
                        <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400 dark:text-zinc-500 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                      </div>
                      <div className="min-w-0 flex-1 max-w-[150px] sm:max-w-[250px] lg:max-w-md">
                        <p className="text-[11px] sm:text-xs lg:text-sm font-extrabold text-gray-900 dark:text-zinc-100 truncate tracking-tight uppercase" title={doc.title}>{doc.title}</p>
                        <p className="text-[9px] lg:text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest truncate mt-0.5" title={doc.category}>
                          <span>{doc.published_at ? new Date(doc.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'} • </span>
                          {doc.category}
                        </p>
                        {(() => {
                          const normTitle = (doc.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                          const isCrossIndexed = !!doc.is_cross_indexed || (!!crossTitlesSet && crossTitlesSet.has(normTitle));
                          const isExternal = doc.source === 'scopus' || doc.source === 'scholar';
                          return (
                            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                              {isExternal ? (
                                <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[8px] font-black uppercase rounded border border-blue-100 dark:border-blue-900/40 flex items-center gap-1">
                                  🌐 API {doc.source === 'scopus' ? 'Scopus' : 'Scholar'}
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-[8px] font-black uppercase rounded border border-slate-200 dark:border-zinc-700 flex items-center gap-1">
                                  ✍️ Input Manual
                                </span>
                              )}
                              {doc.source === 'scholar' && (
                                <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[8px] font-black uppercase rounded border border-blue-100 dark:border-blue-900/40 flex items-center gap-1">
                                  📊 {doc.citations || 0} Sitasi
                                </span>
                              )}
                              {isCrossIndexed && (
                                <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-500/20 shadow-sm flex items-center gap-1">
                                  🔗 Cross-Indexed
                                </span>
                              )}
                              {doc.quartile && (
                                <span className="px-1.5 py-0.5 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-[8px] font-black uppercase rounded border border-orange-100/50 dark:border-orange-900/20">
                                  {doc.quartile}
                                </span>
                              )}
                              {doc.author_role && (
                                <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-[8px] font-black uppercase rounded border border-indigo-100/50 dark:border-indigo-900/20">
                                  {doc.author_role === 'Single Author' ? 'Single' : doc.author_role === 'First Author' ? '1st Author' : 'Co-Author'}
                                </span>
                              )}
                              {doc.is_hyperauthor && (
                                <span className="px-1.5 py-0.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-[8px] font-black uppercase rounded border border-red-100/50 dark:border-red-900/20">
                                  Hyper
                                </span>
                              )}
                              {doc.is_corresponding && (
                                <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase rounded border border-emerald-100/50 dark:border-emerald-900/20">
                                  Corresponding
                                </span>
                              )}
                            </div>
                          );
                        })()}

                        {/* Correspondence & Breakdown Controls */}
                        {(() => {
                          const isJI = doc.category === 'Jurnal Internasional';
                          const isJN = doc.category === 'Jurnal Nasional';
                          if (!isJI && !isJN) return null;

                          const totalAuthors = Number(doc.total_authors) || 1;
                          const showCorrespondingControls = doc.author_role !== 'Single Author' && totalAuthors > 1 && doc.source !== 'scholar';
                          const bd = getBreakdown(doc);
                          const isExpanded = !!expandedPoints[doc.id];
                          const isEditing = !!isEditingCorrespondingMap[doc.id];

                          return (
                            <div className="mt-3 space-y-3 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                              {/* Konfirmasi status korespondensi untuk co-author. Skema poin KPI berbeda jika corresponding author */}
                              {showCorrespondingControls && (
                                <div className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner transition-colors duration-200 ${
                                  !doc.is_corresponding_confirmed && !isEditing
                                    ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-800/30'
                                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                                }`}>

                                  {doc.is_corresponding_confirmed && !isEditing ? (
                                    <>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[8px] font-black uppercase tracking-wider border border-emerald-500/20 shadow-sm">
                                          ✓ Dikonfirmasi
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                          Penulis korespondensi:
                                        </span>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[8px] font-black uppercase tracking-wider border shadow-sm ${
                                          doc.is_corresponding
                                            ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
                                            : 'bg-slate-200/60 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400 border-slate-300/40 dark:border-slate-600/40'
                                        }`}>
                                          {doc.is_corresponding ? '✓ YA' : '✗ TIDAK'}
                                        </span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => setIsEditingCorrespondingMap(prev => ({ ...prev, [doc.id]: true }))}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:text-orange-600 hover:border-orange-400 dark:hover:border-orange-500/50 dark:hover:text-orange-400 transition-all whitespace-nowrap shadow-sm ml-auto"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                        Ubah
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex flex-wrap items-center gap-2">
                                        {isEditing ? (
                                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-[8px] font-black uppercase tracking-wider border border-blue-500/20 shadow-sm">
                                            ✏️ Ubah Pilihan
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-[8px] font-black uppercase tracking-wider border border-amber-500/20 animate-pulse shadow-sm">
                                            ⚠️ Perlu Konfirmasi
                                          </span>
                                        )}
                                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                          Apakah Anda penulis korespondensi?
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2 ml-auto">
                                        <button
                                          type="button"
                                          disabled={updatingCorrespondingId === doc.id}
                                          onClick={async () => {
                                            setUpdatingCorrespondingId(doc.id);
                                            if (handleToggleCorresponding) {
                                              await handleToggleCorresponding(doc.id, true);
                                            }
                                            setIsEditingCorrespondingMap(prev => ({ ...prev, [doc.id]: false }));
                                            setUpdatingCorrespondingId(null);
                                          }}
                                          className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border bg-orange-600 border-orange-600 text-white hover:bg-orange-700 active:scale-95 shadow-md shadow-orange-500/20 disabled:opacity-50"
                                        >
                                          Ya
                                        </button>
                                        <button
                                          type="button"
                                          disabled={updatingCorrespondingId === doc.id}
                                          onClick={async () => {
                                            setUpdatingCorrespondingId(doc.id);
                                            if (handleToggleCorresponding) {
                                              await handleToggleCorresponding(doc.id, false);
                                            }
                                            setIsEditingCorrespondingMap(prev => ({ ...prev, [doc.id]: false }));
                                            setUpdatingCorrespondingId(null);
                                          }}
                                          className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 active:scale-95 disabled:opacity-50"
                                        >
                                          Tidak
                                        </button>
                                        {updatingCorrespondingId === doc.id ? (
                                          <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                                        ) : isEditing && (
                                          <button
                                            type="button"
                                            onClick={() => setIsEditingCorrespondingMap(prev => ({ ...prev, [doc.id]: false }))}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            title="Batal"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                            </svg>
                                          </button>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}

                              {bd && (
                                <div className="flex flex-col items-start gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setExpandedPoints(prev => ({ ...prev, [doc.id]: !prev[doc.id] }))}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                                      isExpanded
                                        ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 border-orange-200 dark:border-orange-900/50'
                                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50/60 dark:hover:bg-orange-950/20'
                                    }`}
                                  >
                                    {isExpanded ? '▲ Sembunyikan' : '▼ Rincian Poin'}
                                  </button>

                                  {isExpanded && (
                                    bd.type === 'scholar' ? (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-3 rounded-2xl border border-blue-100 dark:border-blue-900/30 overflow-hidden w-full max-w-xl"
                                      >
                                        <div className="px-4 py-2.5 bg-blue-50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/30">
                                          <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                            RINCIAN PERHITUNGAN POIN (SINTA GS)
                                          </p>
                                        </div>
                                        <div className="p-4 space-y-2 bg-white dark:bg-slate-900">
                                          <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                                            <div>
                                              <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">Dokumen GS</p>
                                              <p className="text-[9px] font-medium text-slate-400">Poin flat per publikasi Google Scholar</p>
                                            </div>
                                            <span className="text-[11px] font-black text-blue-600 flex-shrink-0">+0.50</span>
                                          </div>

                                          <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                                            <div>
                                              <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">Dokumen Tersitasi</p>
                                              <p className="text-[9px] font-medium text-slate-400">Poin tambahan flat jika sitasi &gt; 0</p>
                                            </div>
                                            <span className="text-[11px] font-black text-blue-600 flex-shrink-0">
                                              +{bd.citationBonus.toFixed(2)}
                                            </span>
                                          </div>

                                          <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                                            <div>
                                              <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">
                                                Sitasi (×{Math.min(bd.citations, 500)} × 0.25)
                                                {bd.citations > 500 && ' (Cut-off 500)'}
                                              </p>
                                              <p className="text-[9px] font-medium text-slate-400">Nilai bobot per sitasi yang didapat</p>
                                            </div>
                                            <span className="text-[11px] font-black text-blue-600 flex-shrink-0">
                                              +{bd.citationPoints.toFixed(2)}
                                            </span>
                                          </div>

                                          <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">TOTAL POIN</span>
                                            <span className="text-base font-black text-blue-600">{bd.totalPoints} pts</span>
                                          </div>
                                        </div>
                                      </motion.div>
                                    ) : (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-3 rounded-2xl border border-orange-100 dark:border-orange-900/30 overflow-hidden w-full max-w-xl"
                                      >
                                        <div className="px-4 py-2.5 bg-orange-50 dark:bg-orange-950/30 border-b border-orange-100 dark:border-orange-900/30">
                                          <p className="text-[9px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest">
                                            RINCIAN KALKULASI POIN SINTA (SKEMA PERSENTASE + QUARTILE)
                                          </p>
                                        </div>
                                        <div className="p-4 space-y-2 bg-white dark:bg-slate-900">
                                          {(() => {
                                            const normTitle = (doc.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                                            const isCrossIndexed = !!doc.is_cross_indexed || (!!crossTitlesSet && crossTitlesSet.has(normTitle));
                                            if (!isCrossIndexed) return null;
                                            return (
                                              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl flex flex-wrap items-center justify-between gap-2 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                                                <span className="flex items-center gap-1.5">
                                                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                                  🔗 Irisan Publikasi Scopus & Google Scholar
                                                </span>
                                                <span className="font-black text-[8px] bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md">
                                                  Skema Scopus Digunakan (No Double-Count)
                                                </span>
                                              </div>
                                            );
                                          })()}
                                          <div className="flex items-center gap-2 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                              QUARTILE JURNAL:
                                            </span>
                                            {bd.q !== 'None' ? (
                                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                                                bd.q === 'Q1' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                bd.q === 'Q2' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' :
                                                bd.q === 'Q3' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                              }`}>{bd.q}</span>
                                            ) : (
                                              <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">Tidak terdeteksi</span>
                                            )}
                                          </div>

                                          <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                                            <div>
                                              <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">Poin Maks {bd.q !== 'None' ? bd.q : 'Tanpa Quartile'}</p>
                                              <p className="text-[9px] font-medium text-slate-400">Q1=40, Q2=38, Q3=35, Q4/None=33 pts</p>
                                            </div>
                                            <span className="text-[11px] font-black text-slate-500 flex-shrink-0">{bd.maxPoints} pts</span>
                                          </div>

                                          <div className="flex justify-between items-start py-1.5 border-b border-slate-100 dark:border-slate-800 gap-2">
                                            <div>
                                              <p className="text-[10px] font-black text-slate-700 dark:text-slate-300">{bd.detailStr}</p>
                                              <p className="text-[9px] font-bold text-orange-500">{bd.pctStr}</p>
                                            </div>
                                            <span className="text-[11px] font-black text-orange-600 flex-shrink-0">+{bd.totalPoints}</span>
                                          </div>

                                          {bd.totalAuthors > 1 && (
                                            <div className="flex justify-between items-center py-1 gap-2 border-b border-slate-100 dark:border-slate-800">
                                              <p className="text-[9px] font-medium text-slate-400">Total penulis terdeteksi</p>
                                              <span className="text-[9px] font-black text-slate-500">{bd.totalAuthors} penulis</span>
                                            </div>
                                          )}

                                          <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                                            <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide">TOTAL POIN</span>
                                            <span className="text-base font-black text-orange-600">{bd.totalPoints} pts</span>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )
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
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1" /> Lihat Dokumen
                      </button>
                    ) : (
                      <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-zinc-800 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer whitespace-nowrap">
                        {uploadingPdfId === doc.id ? (
                          <span className="animate-pulse">Uploading...</span>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 mr-1" /> Upload File
                            <input type="file" accept=".pdf" className="sr-only" onChange={(e) => handleUploadPdf(e, doc.id)} disabled={uploadingPdfId === doc.id} />
                          </>
                        )}
                      </label>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                    <div className={`inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-xl font-black text-[9px] lg:text-[10px] uppercase tracking-widest whitespace-nowrap ${
                      doc.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-900/30' :
                      doc.status === 'Rejected' ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 shadow-sm border border-red-100 dark:border-red-900/30' :
                      doc.status === 'Verified by Fakultas' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-900/30' :
                      'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 shadow-sm border border-amber-100 dark:border-amber-900/30'
                    }`}>
                      {doc.status === 'Approved' && <CheckCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 lg:mr-1.5" />}
                      {doc.status === 'Rejected' && <XCircle className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 lg:mr-1.5" />}
                      {(doc.status === 'Pending' || doc.status === 'Verified by Fakultas') && <Clock className="w-3 h-3 lg:w-3.5 lg:h-3.5 mr-1 lg:mr-1.5" />}
                      <span className="hidden sm:inline">{doc.status === 'Verified by Fakultas' ? 'Verified (Fakultas)' : doc.status}</span>
                      <span className="sm:hidden">{doc.status === 'Approved' ? 'OK' : doc.status === 'Rejected' ? 'NO' : doc.status === 'Verified by Fakultas' ? 'V-FAK' : 'Wait'}</span>
                    </div>
                  </td>

                  {/* Poin */}
                  <td className="px-4 lg:px-8 py-4 lg:py-5 align-middle">
                    <span className="text-[11px] sm:text-xs lg:text-sm font-black text-primary-800 dark:text-primary-400 tracking-tighter whitespace-nowrap">
                      +{Math.round(doc.source === 'scholar' ? calculateScholarPoints(doc) : (doc.awarded_points ?? 0))} PTS
                    </span>
                  </td>

                  {/* View Detail Button */}
                  <td className="px-4 py-4 text-center align-middle">
                    <button
                      type="button"
                      onClick={() => setSelectedDocForDetail(doc)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 dark:text-zinc-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all flex items-center justify-center mx-auto"
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
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-600 transition-all" title="Hapus Publikasi">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : isDocLocked(doc) ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-300 dark:text-zinc-600 text-[9px] font-black uppercase tracking-widest cursor-not-allowed" title="Dokumen sudah diverifikasi — tidak dapat diubah">
                        <Lock className="w-3 h-3" /> Terkunci
                      </span>
                    ) : (
                      <div className="flex items-center justify-center gap-1">
                        <button type="button" onClick={() => openEditModal(doc)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 text-gray-400 hover:text-blue-600 transition-all" title="Edit Publikasi">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => { setDeleteDoc(doc); setIsDeleteModalOpen(true); }}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-600 transition-all" title="Hapus Publikasi">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 lg:px-8 py-16 text-center">
                  <div className="flex flex-col items-center">
                     <FileText className="w-12 h-12 text-gray-200 dark:text-zinc-700 mb-4" />
                     <p className="text-sm font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest italic">Inventory Empty</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === Pagination Controls === */}
      {!isTableLoading && filteredDocuments.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 px-8 py-8 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/5 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
              Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredDocuments.length)} of {filteredDocuments.length}
            </span>
            <div className="h-5 w-px bg-gray-200 dark:bg-zinc-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Limit:</span>
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

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .map((p, index, array) => (
                  <React.Fragment key={p}>
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="px-2 text-gray-300 font-bold">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(p)}
                      className={`min-w-[44px] h-11 flex items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        currentPage === p 
                          ? 'bg-primary-600 text-white shadow-sm' 
                          : 'bg-white dark:bg-zinc-900 text-gray-500 border border-gray-100 dark:border-zinc-800 hover:bg-slate-50 hover:text-primary-600 shadow-sm'
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
              className="p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
}
