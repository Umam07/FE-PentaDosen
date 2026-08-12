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
    <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500 dark:text-zinc-400">
          Menampilkan <span className="font-semibold text-gray-800 dark:text-zinc-200">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)}</span> dari <span className="font-semibold text-gray-800 dark:text-zinc-200">{totalItems}</span> Log
        </span>
        <div className="h-4 w-px bg-gray-200 dark:bg-zinc-700 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-gray-400">Limit:</span>
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

      <div className="flex items-center gap-1.5">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange((p) => Math.max(1, p - 1))}
          className="p-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-primary-600 hover:border-primary-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((p, index, array) => (
              <React.Fragment key={p}>
                {index > 0 && array[index - 1] !== p - 1 && (
                  <span className="px-1 text-gray-300 dark:text-zinc-600 text-xs">...</span>
                )}
                <button
                  onClick={() => onPageChange(p)}
                  className={`min-w-[34px] h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                    currentPage === p
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-primary-600'
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
          className="p-2 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-primary-600 hover:border-primary-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
