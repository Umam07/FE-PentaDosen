import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Info } from 'lucide-react';
import { getCategoryTheme } from '../../utils';
import Pagination from '../Pagination';

interface DefaultCardListProps {
  filteredDocs: any[];
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setSelectedDocForDetail: (doc: any) => void;
  setPreviewDoc: (preview: { fileUrl: string; title: string; category: string } | null) => void;
}

const formatDateVal = (dateStr: string | number) => {
  if (!dateStr) return '-';
  const str = String(dateStr);
  if (str.length === 4 && !isNaN(Number(str))) {
    return str;
  }
  try {
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return str;
  }
};

export default function DefaultCardList({
  filteredDocs,
  currentPage,
  itemsPerPage,
  setCurrentPage,
  setSelectedDocForDetail,
  setPreviewDoc,
}: DefaultCardListProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((doc, idx) => {
          const theme = getCategoryTheme(doc.category);
          const dateStr = doc.published_at || doc.tahun_pelaksanaan;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`group flex items-center gap-6 p-6 rounded-3xl border transition-all ${theme.bg} ${theme.border}`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm transition-colors ${theme.iconBg}`}>
                <span className="text-lg font-black text-slate-900 dark:text-white leading-none">
                  {Math.round(Number(doc.awarded_points) || 0)}
                </span>
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mt-1">
                  PTS
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest ${theme.badgeBg} ${theme.badgeText}`}>
                    {doc.category}
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> 
                    {formatDateVal(dateStr)}
                  </span>
                </div>
                <h3 
                  onClick={() => setSelectedDocForDetail(doc)}
                  className="text-sm font-black text-slate-800 dark:text-slate-200 leading-snug line-clamp-1 cursor-pointer hover:text-primary-600 transition-colors"
                >
                  {doc.title}
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end text-right gap-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    ID Dokumen
                  </span>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    {doc.id_dokumen || 'INTERNAL-' + doc.id}
                  </span>
                </div>
                {doc.file_url && doc.file_url !== '-' ? (
                  <button
                    onClick={() => setPreviewDoc({ fileUrl: doc.file_url, title: doc.title, category: doc.category })}
                    className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 transition-all flex items-center justify-center shadow-sm"
                    title="Lihat Dokumen"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                ) : null}
                <button
                  onClick={() => setSelectedDocForDetail(doc)}
                  className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary-600 hover:border-primary-200 transition-all flex items-center justify-center shadow-sm"
                  title="Lihat Detail"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
      <Pagination 
        totalItems={filteredDocs.length} 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
      />
    </>
  );
}
