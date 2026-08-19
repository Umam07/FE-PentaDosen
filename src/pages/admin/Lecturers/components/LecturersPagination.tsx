import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DropdownSelect } from '../../../../components/ui/DropdownSelect';
import { LecturersPaginationProps } from '../types/lecturers.types';

export default function LecturersPagination({
  currentPage,
  itemsPerPage,
  totalItems,
  totalPages,
  onPageChange,
  onItemsPerPageChange
}: LecturersPaginationProps) {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <div className="px-6 py-4 border-t border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted dark:text-on-dark-muted">
          Menampilkan <span className="font-semibold font-mono text-ink-heading dark:text-on-dark">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)}</span> dari <span className="font-semibold font-mono text-ink-heading dark:text-on-dark">{totalItems}</span> Dosen
        </span>
        <div className="h-4 w-px bg-hairline-light dark:bg-hairline-dark hidden sm:block" />
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-muted dark:text-on-dark-muted">Limit:</span>
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
          onClick={() => onPageChange(p => Math.max(1, p - 1))}
          className="p-2 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((p, index, array) => (
              <React.Fragment key={p}>
                {index > 0 && array[index - 1] !== p - 1 && (
                  <span className="px-1 text-muted-soft dark:text-on-dark-muted text-xs font-mono">...</span>
                )}
                <button
                  onClick={() => onPageChange(p)}
                  className={`min-w-[34px] h-8 flex items-center justify-center rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    currentPage === p 
                      ? 'bg-ink text-on-ink dark:bg-surface-dark-elevated dark:text-on-dark font-semibold shadow-xs' 
                      : 'bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark'
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}
        </div>

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(p => Math.min(totalPages, p + 1))}
          className="p-2 rounded-lg border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
