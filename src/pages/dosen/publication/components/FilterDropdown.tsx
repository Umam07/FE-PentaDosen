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
  /** Menandakan apakah item membutuhkan penanda khusus (misal dot orange untuk urgent) */
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
 * Komponen dropdown spesifik per kategori filter publikasi dengan styling netral slate/zinc standar.
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
  // Cari opsi yang sedang aktif dari list options
  const activeOption = options.find((opt) => opt.id === activeValue) || options[0];
  
  // Tentukan apakah filter sedang aktif (opsi terpilih ≠ default 'all')
  const isFiltered = activeValue !== defaultValue;
  
  // Tentukan apakah opsi terpilih merupakan kategori urgent (misal "Perlu Konfirmasi")
  const isUrgentActive = Boolean(activeOption?.isUrgent);

  // Trigger Button View (Tombol dropdown tertutup)
  // Styling Netral Slate/Zinc:
  // - Default (isFiltered = false): Teks netral `text-slate-700 dark:text-zinc-200`, border netral `border-slate-200 dark:border-zinc-700/80`
  // - Aktif (isFiltered = true): Teks hitam pekat `text-slate-900 dark:text-zinc-50`, border `border-slate-400 dark:border-zinc-500`, bg `bg-slate-100/80 dark:bg-zinc-800`
  const triggerElement = (
    <div
      className={`flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl text-xs transition-all border cursor-pointer ${
        isFiltered
          ? 'border-slate-400 dark:border-zinc-500 text-slate-900 dark:text-zinc-50 font-bold bg-slate-100/80 dark:bg-zinc-800 shadow-2xs'
          : 'border-slate-200 dark:border-zinc-700/80 text-slate-700 dark:text-zinc-200 font-medium bg-white dark:bg-zinc-800/80 hover:bg-slate-50 dark:hover:bg-zinc-700/60 hover:border-slate-300 dark:hover:border-zinc-600'
      }`}
    >
      <div className="flex items-center gap-1.5 truncate">
        {/* Dot orange indikator urgent di sebelah kiri label trigger */}
        {isUrgentActive && (
          <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" title="Perlu Konfirmasi Status" />
        )}
        <span className="truncate">
          {categoryLabel}: <span className={isFiltered ? 'font-black text-slate-900 dark:text-zinc-50' : 'font-semibold text-slate-800 dark:text-zinc-100'}>{activeOption?.label || activeValue}</span> ({activeOption?.count ?? 0})
        </span>
      </div>
      <ChevronDown
        className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
          isFiltered ? 'text-slate-700 dark:text-zinc-300' : 'text-slate-400 dark:text-zinc-500'
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
      <div className="py-1 space-y-0.5 max-h-60 overflow-y-auto">
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
              className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors text-left ${
                isDisabled
                  ? 'opacity-50 cursor-not-allowed text-slate-400 dark:text-zinc-600'
                  : isSelected
                  ? 'bg-slate-100 dark:bg-zinc-700/80 text-slate-900 dark:text-zinc-50 font-bold'
                  : 'text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800/60'
              }`}
            >
              <div className="flex items-center gap-2 truncate pr-2">
                {/* Checkmark icon jika opsi aktif */}
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-slate-900 dark:text-zinc-100 shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 shrink-0" />
                )}

                {/* Dot orange untuk item urgent ("Perlu Konfirmasi") */}
                {option.isUrgent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                )}

                <span className="truncate">{option.label}</span>
              </div>

              {/* Count di kanan */}
              <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 shrink-0 ml-2">
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
