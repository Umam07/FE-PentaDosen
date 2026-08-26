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
    <div className="overflow-hidden rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-xs">
      <div className="flex items-center justify-between px-5 py-4 border-b border-hairline-light-soft dark:border-hairline-dark-soft">
        <div className="flex items-center gap-2.5">
          <FileQuestion className="w-4 h-4 text-accent dark:text-accent-on-dark" />
          <h2 className="text-sm font-semibold text-ink-heading dark:text-on-dark">Manual Book &amp; Panduan Penggunaan</h2>
        </div>
        <span className="text-[11px] font-semibold text-body dark:text-on-dark-soft bg-ink-soft dark:bg-surface-dark-elevated px-2.5 py-1 rounded-md font-mono">
          {filteredFaqs.length} Panduan
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-2.5">
        {loading ? (
          <div className="block space-y-2.5 animate-pulse">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="h-16 w-full bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl flex items-center px-5 justify-between"
              >
                <div className="flex items-center gap-3 w-2/3">
                  <div className="h-9 w-9 rounded-lg bg-hairline-light dark:bg-hairline-dark" />
                  <div className="h-3.5 bg-hairline-light dark:bg-hairline-dark rounded w-4/5" />
                </div>
                <div className="h-4 w-4 bg-hairline-light dark:bg-hairline-dark rounded-full" />
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
                    ? 'border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-xs'
                    : 'border-hairline-light dark:border-hairline-dark bg-surface-light-raised/40 dark:bg-surface-dark-soft/40 hover:border-ink-border dark:hover:border-hairline-dark'
                }`}
              >
                <button
                  onClick={() => onToggleExpand(faq.id)}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? `Tutup panduan: ${faq.question}` : `Buka panduan: ${faq.question}`}
                  className="w-full px-5 py-4 text-left flex justify-between items-center gap-4 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-xl group cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-soft text-body dark:bg-surface-dark-elevated dark:text-on-dark-soft">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-ink-heading dark:text-on-dark truncate">
                      {faq.question}
                    </span>
                  </div>

                  <ChevronDown className={`w-4 h-4 flex-shrink-0 text-muted dark:text-on-dark-muted transition-transform duration-200 ${isExpanded ? 'rotate-180 text-ink-heading dark:text-on-dark' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-hairline-light-soft dark:border-hairline-dark-soft text-xs sm:text-sm font-normal text-body dark:text-on-dark-soft leading-relaxed whitespace-pre-line">
                        <p className="pl-[52px]">{faq.answer}</p>
                        {faq.file_url && (
                          <div className="mt-4 pl-[52px]">
                            <button
                              onClick={() => onPreviewDoc({
                                fileUrl: faq.file_url!,
                                title: faq.question,
                                category: faq.category
                              })}
                              aria-label={`Lihat Panduan PDF untuk ${faq.question}`}
                              className="inline-flex items-center gap-2 px-3.5 py-2 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-ink-heading dark:text-on-dark border border-hairline-light dark:border-hairline-dark rounded-lg text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
                            >
                              <FileText className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted" />
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
            <div className="w-12 h-12 bg-ink-soft dark:bg-surface-dark-elevated rounded-xl flex items-center justify-center mx-auto mb-3.5 border border-hairline-light dark:border-hairline-dark text-muted dark:text-on-dark-muted">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-ink-heading dark:text-on-dark mb-1">Panduan Tidak Ditemukan</h3>
            <p className="text-xs text-muted dark:text-on-dark-muted max-w-sm mx-auto leading-relaxed mb-4">
              Tidak ada panduan yang cocok dengan kata kunci &quot;<span className="font-semibold text-body-strong dark:text-on-dark">{searchQuery}</span>&quot;.
            </p>
            <button
              onClick={onClearSearch}
              aria-label="Bersihkan pencarian"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-light-raised hover:bg-hairline-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-body dark:text-on-dark border border-hairline-light dark:border-hairline-dark text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="w-3.5 h-3.5" />
              <span>Bersihkan Pencarian</span>
            </button>
          </div>
        ) : (
          <div className="py-14 px-4 text-center">
            <div className="w-12 h-12 bg-ink-soft dark:bg-surface-dark-elevated rounded-xl flex items-center justify-center mx-auto mb-3.5 border border-hairline-light dark:border-hairline-dark text-muted dark:text-on-dark-muted">
              <FileQuestion className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-ink-heading dark:text-on-dark mb-1">
              Belum Ada Panduan
            </h3>
            <p className="text-xs text-muted dark:text-on-dark-muted max-w-sm mx-auto leading-relaxed mb-4">
              Panduan dan manual book sedang disiapkan oleh administrator.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

