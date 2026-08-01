import React from 'react';
import {
  FileQuestion, HelpCircle, ChevronDown, FileText, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { FaqAccordionListProps } from '../types/faqHelp.types';

export default function FaqAccordionList({
  loading,
  filteredFaqs,
  expandedFaqId,
  searchQuery,
  onToggleExpand,
  onPreviewDoc,
  onClearSearch,
}: FaqAccordionListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <FileQuestion className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Manual Book &amp; Panduan Penggunaan</h3>
        </div>
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
          {filteredFaqs.length} Panduan
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-2.5">
        {loading ? (
          <div className="block space-y-2.5 animate-pulse">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="h-16 w-full bg-slate-50 dark:bg-slate-800/40 rounded-xl flex items-center px-5 justify-between"
              >
                <div className="flex items-center gap-3 w-2/3">
                  <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-700" />
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
                </div>
                <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-xl border overflow-hidden transition-all ${
                  isExpanded
                    ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => onToggleExpand(faq.id)}
                  className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 focus:outline-none group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/30 dark:text-primary-400">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {faq.question}
                    </span>
                  </div>

                  <ChevronDown className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-slate-900 dark:text-white' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/50 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        <p className="pl-[52px]">{faq.answer}</p>
                        {faq.file_url && (
                          <div className="mt-4 pl-[52px]">
                            <button
                              onClick={() => onPreviewDoc({
                                fileUrl: faq.file_url!,
                                title: faq.question,
                                category: faq.category
                              })}
                              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                              <span>Lihat Panduan PDF</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : searchQuery ? (
          <div className="py-14 px-4 text-center">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3.5 border border-slate-200 dark:border-slate-700">
              <HelpCircle className="w-6 h-6 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Panduan Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-4">
              Tidak ada panduan yang cocok dengan kata kunci &quot;<span className="font-semibold text-slate-700 dark:text-slate-300">{searchQuery}</span>&quot;.
            </p>
            <button
              onClick={onClearSearch}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Bersihkan Pencarian</span>
            </button>
          </div>
        ) : (
          <div className="py-14 px-4 text-center">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center justify-center mx-auto mb-3.5 border border-slate-200 dark:border-slate-700">
              <FileQuestion className="w-6 h-6 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
              Belum Ada Panduan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-4">
              Panduan dan manual book sedang disiapkan oleh administrator.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
