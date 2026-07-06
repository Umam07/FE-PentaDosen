import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import { ActivityLogsPaginationProps } from '../types/activityLogs.types';

export default function ActivityLogsPagination({
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
  onPageChange,
  onItemsPerPageChange
}: ActivityLogsPaginationProps) {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative z-10 px-8 py-8 border-t border-gray-50 dark:border-zinc-800 bg-gray-50/5 flex flex-col sm:flex-row items-center justify-between gap-6"
    >
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
          Showing {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, totalItems)} of {totalItems}
        </span>
        <div className="h-5 w-px bg-gray-200 dark:bg-zinc-700 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Limit:</span>
          <DropdownSelect
            value={itemsPerPage}
            onChange={(val) => { onItemsPerPageChange(Number(val)); onPageChange(1); }}
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
          onClick={() => onPageChange((p) => Math.max(1, p - 1))}
          className="p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((p, index, array) => (
              <React.Fragment key={p}>
                {index > 0 && array[index - 1] !== p - 1 && (
                  <span className="px-2 text-gray-300 dark:text-zinc-600 font-bold">...</span>
                )}
                <button
                  onClick={() => onPageChange(p)}
                  className={`min-w-[44px] h-11 flex items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    currentPage === p
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600 dark:hover:text-primary-400 shadow-sm'
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}
        </div>

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
          className="p-3 rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
