import React from 'react';
import { Filter } from 'lucide-react';
import type { CategorySelectorProps } from '../types/adminInputDocument.types';

export default function CategorySelector({
  mainCategories,
  mainCategory,
  subCategoryOptions,
  subCategory,
  onSelectMainCategory,
  onSelectSubCategory,
}: CategorySelectorProps) {
  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl text-ink-heading dark:text-on-dark border border-hairline-light-soft dark:border-hairline-dark-soft">
          <Filter className="w-5 h-5 text-accent dark:text-accent-on-dark" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-ink-heading dark:text-on-dark tracking-tight">Kategori Dokumen</h3>
      </div>

      {/* Main Categories Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {mainCategories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = mainCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectMainCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-accent dark:border-accent-on-dark bg-accent-soft/40 dark:bg-accent/10 text-accent dark:text-accent-on-dark font-bold shadow-xs'
                  : 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-muted dark:text-on-dark-muted hover:border-hairline-light-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated hover:text-ink-heading dark:hover:text-on-dark'
              }`}
            >
              <Icon className="w-6 h-6 mb-2" />
              <span className="text-xs font-semibold uppercase tracking-wider text-center">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub Category Selection */}
      {subCategoryOptions.length > 0 && (
        <div className="space-y-3 pt-2">
          <label className="text-xs font-semibold text-muted dark:text-on-dark-muted uppercase tracking-wider ml-1">
            Sub-Kategori / Jenis {mainCategory}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {subCategoryOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = subCategory === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => onSelectSubCategory(opt.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-accent dark:border-accent-on-dark bg-accent-soft/30 dark:bg-accent/10 text-ink-heading dark:text-on-dark font-semibold shadow-xs'
                      : 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark text-body dark:text-on-dark-soft hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-accent dark:text-accent-on-dark" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-ink-heading dark:text-on-dark">{opt.label}</p>
                      <p className="text-[10px] font-mono font-semibold text-muted dark:text-on-dark-muted uppercase">{opt.pts} Pts Base</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
