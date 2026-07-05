import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage?: (limit: number) => void;
}

export default function Pagination({
  totalItems,
  currentPage,
  onPageChange,
  itemsPerPage,
  setItemsPerPage
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalItems === 0) return null;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <div className="relative z-10 px-8 py-8 border-t border-slate-100 dark:border-slate-800 bg-gray-50/5 flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
          Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} of {totalItems}
        </span>
        {setItemsPerPage && (
          <>
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Limit:</span>
              <DropdownSelect
                value={itemsPerPage}
                onChange={(val) => { setItemsPerPage(val); onPageChange(1); }}
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
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Halaman sebelumnya"
          className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-zinc-900 text-slate-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((p, index, array) => (
              <React.Fragment key={p}>
                {index > 0 && array[index - 1] !== p - 1 && (
                  <span className="px-2 text-slate-300 font-bold">...</span>
                )}
                <button
                  onClick={() => onPageChange(p)}
                  className={`min-w-[44px] h-11 flex items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    currentPage === p
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-white dark:bg-zinc-900 text-slate-500 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 hover:text-primary-600 shadow-sm'
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}
        </div>

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Halaman berikutnya"
          className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-zinc-900 text-slate-400 hover:text-primary-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

