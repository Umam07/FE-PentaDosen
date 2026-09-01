import React from 'react';
import type { FaqCategoryFilterProps } from '../types/faqHelp.types';

export default function FaqCategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: FaqCategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-0.5">
      <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light-soft dark:border-hairline-dark-soft min-w-max">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const hasCount = typeof cat.count === 'number' && cat.count > 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              aria-pressed={isSelected}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent ${
                isSelected
                  ? 'bg-surface-light dark:bg-surface-dark text-ink-heading dark:text-on-dark shadow-xs border border-hairline-light/60 dark:border-hairline-dark/60'
                  : 'text-muted dark:text-on-dark-muted hover:text-body dark:hover:text-on-dark hover:bg-surface-light/40 dark:hover:bg-surface-dark/40 border border-transparent'
              }`}
            >
              <span>{cat.name}</span>
              {hasCount && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md transition-colors ${
                    isSelected
                      ? 'bg-ink-soft dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark'
                      : 'bg-hairline-light-soft dark:bg-surface-dark text-muted dark:text-on-dark-muted'
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
