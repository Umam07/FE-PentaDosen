import React from 'react';
import {
  BookOpen, RefreshCw, Award, ArrowUpRight, FileText
} from 'lucide-react';
import type { FaqRightSidebarProps } from '../types/faqHelp.types';

export default function FaqRightSidebar({
  onSelectCategory,
  onPreviewManualBookPdf,
}: FaqRightSidebarProps) {
  return (
    <div className="space-y-4">
      {/* WIDGET: AKSES CEPAT DOKUMEN & PANDUAN */}
      <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-hairline-light-soft dark:border-hairline-dark-soft">
          <FileText className="w-4 h-4 text-accent dark:text-accent-on-dark" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-heading dark:text-on-dark font-mono">
            Akses Cepat Panduan
          </h3>
        </div>

        <div className="space-y-2">
          {/* Item 1: Manual Book PDF */}
          <div className="group flex items-center justify-between p-2.5 rounded-xl bg-surface-light-raised/60 hover:bg-surface-light-raised dark:bg-surface-dark-elevated/60 dark:hover:bg-surface-dark-elevated border border-hairline-light-soft dark:border-hairline-dark-soft transition-all">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-accent-soft text-accent dark:bg-accent/15 dark:text-accent-on-dark flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink-heading dark:text-on-dark truncate">
                  Buku Manual Book Resmi
                </p>
                <p className="text-[10.5px] text-muted dark:text-on-dark-muted font-mono">
                  Format PDF Dokumen
                </p>
              </div>
            </div>

            {onPreviewManualBookPdf ? (
              <button
                type="button"
                onClick={onPreviewManualBookPdf}
                aria-label="Buka Manual Book PDF"
                className="p-1.5 rounded-lg bg-surface-light dark:bg-surface-dark hover:text-accent dark:hover:text-accent-on-dark text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer shrink-0"
                title="Buka PDF"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSelectCategory('semua')}
                aria-label="Buka Semua Panduan"
                className="p-1.5 rounded-lg bg-surface-light dark:bg-surface-dark hover:text-accent dark:hover:text-accent-on-dark text-muted dark:text-on-dark-muted border border-hairline-light dark:border-hairline-dark transition-colors cursor-pointer shrink-0"
                title="Lihat"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Item 2: Integrasi SINTA & Scopus */}
          <button
            type="button"
            onClick={() => onSelectCategory('integrasi')}
            className="w-full group flex items-center justify-between p-2.5 rounded-xl bg-surface-light-raised/60 hover:bg-surface-light-raised dark:bg-surface-dark-elevated/60 dark:hover:bg-surface-dark-elevated border border-hairline-light-soft dark:border-hairline-dark-soft transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#fff2e8] text-chart-scopus dark:bg-[#d9823b]/15 dark:text-chart-scopus-dark flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink-heading dark:text-on-dark truncate group-hover:text-chart-scopus dark:group-hover:text-chart-scopus-dark transition-colors">
                  Sinkronisasi SINTA / Scopus
                </p>
                <p className="text-[10.5px] text-muted dark:text-on-dark-muted font-mono">
                  Petunjuk author ID
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted group-hover:text-chart-scopus transition-colors shrink-0" />
          </button>

          {/* Item 3: Matriks Bobot Poin KPI */}
          <button
            type="button"
            onClick={() => onSelectCategory('poin')}
            className="w-full group flex items-center justify-between p-2.5 rounded-xl bg-surface-light-raised/60 hover:bg-surface-light-raised dark:bg-surface-dark-elevated/60 dark:hover:bg-surface-dark-elevated border border-hairline-light-soft dark:border-hairline-dark-soft transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-success-soft text-success-dark dark:bg-success/15 dark:text-success-on-dark flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink-heading dark:text-on-dark truncate group-hover:text-success-dark dark:group-hover:text-success-on-dark transition-colors">
                  Matriks Bobot Poin KPI
                </p>
                <p className="text-[10.5px] text-muted dark:text-on-dark-muted font-mono">
                  Formula Tri Dharma
                </p>
              </div>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-muted dark:text-on-dark-muted group-hover:text-success-dark transition-colors shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
