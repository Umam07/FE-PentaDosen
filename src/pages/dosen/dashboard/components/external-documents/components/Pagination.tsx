import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DropdownSelect } from '../../../../../../components/ui/DropdownSelect';
import { PaginationProps } from '../external-documents.types';

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
    <div className="relative z-10 px-4 sm:px-6 py-3.5 sm:py-4 border-t border-hairline-light dark:border-hairline-dark bg-surface-light-raised dark:bg-surface-dark-elevated flex flex-col sm:flex-row items-center justify-between gap-4 rounded-b-2xl">
      <div className="flex items-center gap-4">
        <span className="text-xs text-muted dark:text-on-dark-muted font-mono">
          Menampilkan <span className="font-bold text-ink-heading dark:text-on-dark tabular-nums">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)}</span> dari <span className="font-bold text-ink-heading dark:text-on-dark tabular-nums">{totalItems}</span> Dokumen
        </span>
        <div className="h-4 w-px bg-hairline-light dark:bg-hairline-dark hidden sm:block" />
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs text-muted dark:text-on-dark-muted">Limit:</span>
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
      </div>

      <div className="flex items-center gap-1.5">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          aria-label="Halaman sebelumnya"
          className="p-2 rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((p, index, array) => (
              <React.Fragment key={p}>
                {index > 0 && array[index - 1] !== p - 1 && (
                  <span className="px-1 text-muted dark:text-on-dark-muted font-mono text-xs">...</span>
                )}
                <button
                  onClick={() => onPageChange(p)}
                  className={`min-w-[34px] h-8 flex items-center justify-center rounded-xl text-xs font-semibold font-mono tabular-nums transition-all cursor-pointer ${currentPage === p
                      ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-2xs'
                      : 'bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark'
                    }`}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}
        </div>

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          aria-label="Halaman berikutnya"
          className="p-2 rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted hover:text-ink-heading dark:hover:text-on-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

