import React from 'react';
import type { FaqCategoryFilterProps } from '../types/faqHelp.types';

export default function FaqCategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: FaqCategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-0.5">
      <div className="flex items-center gap-1.5 min-w-max">
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
                  ? 'bg-ink text-on-ink dark:bg-on-dark dark:text-ink shadow-xs'
                  : 'bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark dark:hover:bg-surface-dark-elevated text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark'
              }`}
            >
              <span>{cat.name}</span>
              {hasCount && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                    isSelected
                      ? 'bg-white/20 text-white dark:bg-ink/20 dark:text-ink'
                      : 'bg-ink-soft text-body-strong dark:bg-surface-dark-elevated dark:text-on-dark-muted'
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
