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
    <div className="px-4 sm:px-6 py-4 border-t border-hairline-light dark:border-hairline-dark bg-surface-light-raised/50 dark:bg-surface-dark/50 flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4">
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-4 w-full sm:w-auto text-center sm:text-left">
        <span className="text-xs text-muted dark:text-on-dark-muted">
          Menampilkan <span className="font-semibold font-mono text-ink-heading dark:text-on-dark tabular-nums">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)}</span> dari <span className="font-semibold font-mono text-ink-heading dark:text-on-dark tabular-nums">{totalItems}</span> Dokumen
        </span>
        {setItemsPerPage && (
          <>
            <div className="h-4 w-px bg-hairline-light dark:bg-hairline-dark hidden sm:block" />
            <div className="flex items-center gap-2">
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
          </>
        )}
      </div>

      <div className="flex items-center justify-center gap-1.5 w-full sm:w-auto">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Halaman sebelumnya"
          className="p-2 rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((p, index, array) => (
              <React.Fragment key={p}>
                {index > 0 && array[index - 1] !== p - 1 && (
                  <span className="px-1 text-muted dark:text-on-dark-muted text-xs font-mono">...</span>
                )}
                <button
                  type="button"
                  onClick={() => onPageChange(p)}
                  aria-label={`Halaman ${p}`}
                  className={`min-w-[34px] h-8 flex items-center justify-center rounded-lg text-xs font-semibold font-mono tabular-nums transition-all cursor-pointer ${
                    currentPage === p
                      ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-2xs'
                      : 'bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark'
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}
        </div>

        <button
          type="button"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Halaman berikutnya"
          className="p-2 rounded-xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


