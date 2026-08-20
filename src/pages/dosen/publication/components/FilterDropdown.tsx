import React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { DropdownPrimitive } from '../../../../components/ui/DropdownPrimitive';

/**
 * Interface untuk struktur data opsi filter
 */
export interface FilterOption {
  /** Identifier unik opsi (misal: 'all', 'unconfirmed', 'Q1') */
  id: string;
  /** Label teks opsi yang ditampilkan (misal: 'Semua', 'Perlu Konfirmasi') */
  label: string;
  /** Jumlah dokumen/item pada opsi ini */
  count: number;
  /** Menandakan apakah item membutuhkan penanda khusus */
  isUrgent?: boolean;
}

/**
 * Interface Props untuk komponen FilterDropdown
 */
export interface FilterDropdownProps {
  /** Nama kategori filter (misal: 'Status', 'Tipe Artikel', 'Quartile Jurnal', 'Sumber Data') */
  categoryLabel: string;
  /** Daftar opsi filter dalam kategori ini */
  options: FilterOption[];
  /** ID opsi yang sedang aktif saat ini */
  activeValue: string;
  /** ID opsi default (default: 'all') */
  defaultValue?: string;
  /** Menandakan apakah panel dropdown sedang terbuka */
  isOpen: boolean;
  /** Callback saat status terbuka/tertutup berubah */
  onOpenChange: (open: boolean) => void;
  /** Callback saat pengguna memilih opsi filter */
  onSelectOption: (optionId: string) => void;
  /** Class tambahan jika diperlukan */
  className?: string;
}

/**
 * FilterDropdown
 * Komponen dropdown filter publikasi dengan styling Warm Neutral Design System.
 */
export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  categoryLabel,
  options,
  activeValue,
  defaultValue = 'all',
  isOpen,
  onOpenChange,
  onSelectOption,
  className = '',
}) => {
  const activeOption = options.find((opt) => opt.id === activeValue) || options[0];
  const isFiltered = activeValue !== defaultValue;

  const triggerElement = (
    <div
      className={`flex items-center justify-between gap-2 px-3.5 py-2 rounded-lg text-xs transition-all border cursor-pointer ${
        isFiltered
          ? 'border-hairline-dark/40 dark:border-hairline-light/40 text-ink-heading dark:text-on-dark font-bold bg-surface-light-raised dark:bg-surface-dark-elevated shadow-2xs'
          : 'border-hairline-light dark:border-hairline-dark text-body dark:text-on-dark-soft font-medium bg-surface-light dark:bg-surface-dark hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:border-ink-border dark:hover:border-hairline-light'
      }`}
    >
      <div className="flex items-center gap-1.5 truncate">
        <span className="truncate">
          {categoryLabel}: <span className={isFiltered ? 'font-bold text-ink-heading dark:text-on-dark' : 'font-semibold text-body-strong dark:text-on-dark'}>{activeOption?.label || activeValue}</span> ({activeOption?.count ?? 0})
        </span>
      </div>
      <ChevronDown
        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
          isFiltered ? 'text-ink-heading dark:text-on-dark' : 'text-muted dark:text-on-dark-muted'
        } ${isOpen ? 'rotate-180' : ''}`}
      />
    </div>
  );

  return (
    <DropdownPrimitive
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      trigger={triggerElement}
      className={className}
    >
      {/* Panel Opsi Dropdown */}
      <div className="py-1 space-y-0.5 max-h-60 overflow-y-auto bg-surface-light dark:bg-surface-dark border border-hairline-light dark:border-hairline-dark rounded-xl shadow-lg">
        {options.map((option) => {
          const isSelected = option.id === activeValue;
          const isDisabled = option.count === 0;

          return (
            <button
              key={option.id}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) {
                  onSelectOption(option.id);
                  onOpenChange(false);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors text-left cursor-pointer ${
                isDisabled
                  ? 'opacity-40 cursor-not-allowed text-muted dark:text-on-dark-muted'
                  : isSelected
                  ? 'bg-surface-light-raised dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark font-bold'
                  : 'text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark'
              }`}
            >
              <div className="flex items-center gap-2 truncate pr-2">
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-ink-heading dark:text-on-dark shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 shrink-0" />
                )}

                <span className="truncate">{option.label}</span>
              </div>

              <span className="text-[11px] font-medium font-mono text-muted dark:text-on-dark-muted shrink-0 ml-2">
                ({option.count})
              </span>
            </button>
          );
        })}
      </div>
    </DropdownPrimitive>
  );
};

export default FilterDropdown;
