import React from 'react';
import {
  FileQuestion, HelpCircle, ChevronDown, FileText, X, Sparkles, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { FaqAccordionListProps, FaqItem } from '../types/faqHelp.types';

export default function FaqAccordionList({
  loading,
  filteredFaqs,
  expandedFaqId,
  searchQuery,
  onToggleExpand,
  onPreviewDoc,
  onClearSearch,
}: FaqAccordionListProps) {
  const getCategoryLabel = (faq: FaqItem): string => {
    if (faq.category) return faq.category;
    const text = `${faq.question} ${faq.answer}`.toLowerCase();
    if (text.includes('sinta') || text.includes('scopus') || text.includes('scholar') || text.includes('sinkron')) {
      return 'Integrasi';
    }
    if (text.includes('poin') || text.includes('kpi') || text.includes('bobot') || text.includes('skor')) {
      return 'Poin KPI';
    }
    if (text.includes('buku') || text.includes('penelitian') || text.includes('hki') || text.includes('publikasi') || text.includes('dokumen')) {
      return 'Dokumen';
    }
    if (text.includes('akun') || text.includes('password') || text.includes('login') || text.includes('profil')) {
      return 'Akun';
    }
    return 'Umum';
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark shadow-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 border-b border-hairline-light-soft dark:border-hairline-dark-soft">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent-soft text-accent dark:bg-accent/15 dark:text-accent-on-dark flex items-center justify-center">
            <FileQuestion className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark tracking-tight">
              Daftar Panduan &amp; Manual Book
            </h2>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-body dark:text-on-dark-soft bg-surface-light-raised dark:bg-surface-dark-elevated border border-hairline-light dark:border-hairline-dark px-2.5 py-0.5 rounded-md font-mono">
          {filteredFaqs.length} Topik
        </span>
      </div>

      {/* Accordion List Body */}
      <div className="p-3.5 sm:p-4 space-y-2.5">
        {loading ? (
          <div className="block space-y-2.5 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="h-16 w-full bg-surface-light-raised dark:bg-surface-dark-elevated rounded-xl flex items-center px-4 justify-between border border-hairline-light-soft dark:border-hairline-dark-soft"
              >
                <div className="flex items-center gap-3 w-3/4">
                  <div className="h-8 w-8 rounded-lg bg-hairline-light dark:bg-hairline-dark shrink-0" />
                  <div className="space-y-1.5 w-full">
                    <div className="h-3.5 bg-hairline-light dark:bg-hairline-dark rounded w-3/5" />
                    <div className="h-2.5 bg-hairline-light dark:bg-hairline-dark rounded w-2/5" />
                  </div>
                </div>
                <div className="h-4 w-4 bg-hairline-light dark:bg-hairline-dark rounded-full" />
              </div>
            ))}
          </div>
        ) : filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            const categoryLabel = getCategoryLabel(faq);

            return (
              <div
                key={faq.id}
                className={`rounded-xl border overflow-hidden transition-all duration-150 ${
                  isExpanded
                    ? 'border-accent/40 dark:border-accent/40 bg-surface-light dark:bg-surface-dark shadow-xs'
                    : 'border-hairline-light dark:border-hairline-dark bg-surface-light-raised/40 dark:bg-surface-dark-soft/40 hover:border-ink-border dark:hover:border-hairline-dark hover:bg-surface-light-raised/70 dark:hover:bg-surface-dark-soft/70'
                }`}
              >
                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => onToggleExpand(faq.id)}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? `Tutup panduan: ${faq.question}` : `Buka panduan: ${faq.question}`}
                  className="w-full px-4 sm:px-4.5 py-3 sm:py-3.5 text-left flex justify-between items-center gap-3 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent rounded-xl group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center transition-colors ${
                      isExpanded
                        ? 'bg-accent text-white dark:bg-accent-on-dark dark:text-ink shadow-xs'
                        : 'bg-surface-light dark:bg-surface-dark-elevated text-muted dark:text-on-dark-muted group-hover:text-ink-heading dark:group-hover:text-on-dark border border-hairline-light dark:border-hairline-dark'
                    }`}>
                      <HelpCircle className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9.5px] font-mono font-bold uppercase px-1.5 py-0.2 rounded-md bg-ink-soft dark:bg-surface-dark-elevated text-body dark:text-on-dark-muted border border-hairline-light-soft dark:border-hairline-dark-soft">
                          {categoryLabel}
                        </span>
                      </div>
                      <h3 className="text-[13px] sm:text-[14px] font-bold text-ink-heading dark:text-on-dark tracking-tight leading-snug group-hover:text-accent dark:group-hover:text-accent-on-dark transition-colors">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-all ${
                    isExpanded
                      ? 'bg-ink-soft dark:bg-surface-dark-elevated text-ink-heading dark:text-on-dark'
                      : 'text-muted dark:text-on-dark-muted group-hover:text-ink-heading dark:group-hover:text-on-dark'
                  }`}>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {/* Expanded Answer Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                    >
                      <div className="px-4 sm:px-5 pb-4 pt-3 border-t border-hairline-light-soft dark:border-hairline-dark-soft bg-surface-light-raised/20 dark:bg-surface-dark-soft/30">
                        {/* Answer Text: Spacious & Readable */}
                        <div className="text-xs sm:text-[13.5px] font-normal text-body dark:text-on-dark-soft leading-relaxed whitespace-pre-line space-y-2.5">
                          {faq.answer}
                        </div>

                        {/* PDF Attachment CTA */}
                        {faq.file_url && (
                          <div className="mt-3.5 pt-3 border-t border-hairline-light-soft dark:border-hairline-dark-soft flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div className="flex items-center gap-1.5 text-[11px] text-muted dark:text-on-dark-muted">
                              <Sparkles className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark shrink-0" />
                              <span>Tersedia dokumen resmi panduan untuk topik ini</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => onPreviewDoc({
                                fileUrl: faq.file_url!,
                                title: faq.question,
                                category: faq.category || categoryLabel
                              })}
                              aria-label={`Buka Dokumen PDF untuk ${faq.question}`}
                              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-surface-light hover:bg-surface-light-raised dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-ink-heading dark:text-on-dark border border-hairline-light dark:border-hairline-dark rounded-lg text-xs font-semibold transition-all shadow-xs hover:border-accent/40 dark:hover:border-accent/40 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent shrink-0"
                            >
                              <FileText className="w-3.5 h-3.5 text-accent dark:text-accent-on-dark" />
                              <span>Buka Dokumen PDF</span>
                              <ExternalLink className="w-3 h-3 text-muted dark:text-on-dark-muted" />
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
          <div className="py-8 px-4 text-center">
            <div className="w-10 h-10 bg-ink-soft dark:bg-surface-dark-elevated rounded-xl flex items-center justify-center mx-auto mb-2.5 border border-hairline-light dark:border-hairline-dark text-muted dark:text-on-dark-muted">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark mb-0.5">
              Panduan Tidak Ditemukan
            </h3>
            <p className="text-[11px] sm:text-xs text-muted dark:text-on-dark-muted max-w-sm mx-auto leading-relaxed mb-3">
              Tidak ada topik yang cocok dengan &quot;<span className="font-semibold text-body-strong dark:text-on-dark">{searchQuery}</span>&quot;.
            </p>
            <button
              type="button"
              onClick={onClearSearch}
              aria-label="Bersihkan pencarian"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-light-raised hover:bg-hairline-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-body dark:text-on-dark border border-hairline-light dark:border-hairline-dark text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
            >
              <X className="w-3.5 h-3.5" />
              <span>Bersihkan Pencarian</span>
            </button>
          </div>
        ) : (
          <div className="py-8 px-4 text-center">
            <div className="w-10 h-10 bg-ink-soft dark:bg-surface-dark-elevated rounded-xl flex items-center justify-center mx-auto mb-2.5 border border-hairline-light dark:border-hairline-dark text-muted dark:text-on-dark-muted">
              <FileQuestion className="w-5 h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-ink-heading dark:text-on-dark mb-0.5">
              Belum Ada Panduan pada Kategori Ini
            </h3>
            <p className="text-[11px] sm:text-xs text-muted dark:text-on-dark-muted max-w-sm mx-auto leading-relaxed">
              Panduan untuk kategori ini sedang disiapkan oleh administrator.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
