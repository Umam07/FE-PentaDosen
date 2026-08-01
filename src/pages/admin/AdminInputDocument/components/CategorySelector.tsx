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
        <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary-600">
          <Filter className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100 uppercase tracking-tight">Kategori Dokumen</h3>
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
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 font-extrabold shadow-sm'
                  : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-500 hover:border-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-6 h-6 mb-2" />
              <span className="text-[11px] font-black uppercase tracking-wider text-center">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub Category Selection */}
      {subCategoryOptions.length > 0 && (
        <div className="space-y-3 pt-2">
          <label className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest ml-1">
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
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50/30 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 font-bold'
                      : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-600 hover:border-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider">{opt.label}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{opt.pts} Pts Base</p>
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
