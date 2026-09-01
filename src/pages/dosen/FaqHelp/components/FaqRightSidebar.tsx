import React from 'react';
import {
  BookOpen, RefreshCw, Award, ArrowUpRight, FileText,
  LifeBuoy, Mail, Clock, MessageSquarePlus, Sparkles, MapPin
} from 'lucide-react';
import type { FaqRightSidebarProps } from '../types/faqHelp.types';

export default function FaqRightSidebar({
  onSelectCategory,
  onPreviewManualBookPdf,
  onOpenCreateTicketModal,
  onSwitchToPesanTab,
  onSelectFaq,
  popularFaqs = [],
}: FaqRightSidebarProps) {
  return (
    <div className="space-y-4">
      {/* WIDGET 1: AKSES CEPAT DOKUMEN & PANDUAN (COMPACT) */}
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

      {/* WIDGET 2: PUSAT BANTUAN & KONTAK HELPDESK LPPM */}
      <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex items-center gap-2 pb-2.5 border-b border-hairline-light-soft dark:border-hairline-dark-soft">
          <LifeBuoy className="w-4 h-4 text-accent dark:text-accent-on-dark" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-heading dark:text-on-dark font-mono">
            Layanan Bantuan LPPM
          </h3>
        </div>

        <p className="text-xs text-body dark:text-on-dark-soft leading-relaxed">
          Mengalami kendala teknis validasi atau butuh bantuan lebih lanjut? Hubungi admin penelitian kami.
        </p>

        <div className="space-y-2 text-[11px] text-muted dark:text-on-dark-muted">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 shrink-0 text-muted" />
            <span>Senin – Jumat, 08.00 – 16.00 WIB</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 shrink-0 text-muted" />
            <a
              href="mailto:lppm@yarsi.ac.id"
              className="hover:underline text-ink-heading dark:text-on-dark font-medium"
            >
              lppm@yarsi.ac.id
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-muted" />
            <span>Gedung LPPM Lt. 2 Universitas YARSI</span>
          </div>
        </div>

        <div className="pt-2 border-t border-hairline-light-soft dark:border-hairline-dark-soft space-y-2">
          <button
            type="button"
            onClick={onOpenCreateTicketModal}
            className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-ink hover:bg-ink-hover active:bg-ink-active text-on-ink dark:bg-on-dark dark:hover:bg-white dark:text-ink text-xs font-semibold transition-all shadow-xs active:scale-95 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Kirim Tiket Pesan ke Admin</span>
          </button>

          <button
            type="button"
            onClick={onSwitchToPesanTab}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-surface-light-raised hover:bg-hairline-light dark:bg-surface-dark-elevated dark:hover:bg-surface-dark text-body dark:text-on-dark-soft border border-hairline-light dark:border-hairline-dark text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>Buka Pusat Pesan Saya</span>
          </button>
        </div>
      </div>

      {/* WIDGET 3: TOPIK POPULER */}
      {popularFaqs.length > 0 && (
        <div className="rounded-2xl border border-hairline-light dark:border-hairline-dark bg-surface-light dark:bg-surface-dark p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-hairline-light-soft dark:border-hairline-dark-soft">
            <Sparkles className="w-4 h-4 text-warning dark:text-warning-on-dark" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-heading dark:text-on-dark font-mono">
              Topik Paling Sering Dicari
            </h3>
          </div>

          <div className="space-y-2">
            {popularFaqs.slice(0, 3).map((faq) => (
              <button
                key={faq.id}
                type="button"
                onClick={() => onSelectFaq(faq.id)}
                className="w-full text-left p-2 rounded-lg hover:bg-surface-light-raised dark:hover:bg-surface-dark-elevated transition-colors cursor-pointer group flex items-start gap-2"
              >
                <span className="text-[11px] font-mono font-bold text-muted dark:text-on-dark-muted mt-0.5 shrink-0">
                  •
                </span>
                <p className="text-xs text-body dark:text-on-dark-soft group-hover:text-accent dark:group-hover:text-accent-on-dark font-medium leading-snug line-clamp-2">
                  {faq.question}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
